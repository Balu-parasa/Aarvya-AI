import os
import json
import logging
from datetime import datetime
from bson import ObjectId
import pymongo
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger(__name__)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aarvya_db")
DB_NAME = os.getenv("MONGODB_DB_NAME", "aarvya_db")

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)

class FallbackCollection:
    """In-memory & JSON file fallback collection that mirrors PyMongo collection semantics."""
    def __init__(self, name, storage_dir="local_db_data"):
        self.name = name
        self.storage_dir = storage_dir
        self.file_path = os.path.join(storage_dir, f"{name}.json")
        self.documents = []
        os.makedirs(storage_dir, exist_ok=True)
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
            except Exception as e:
                logger.warning(f"Error loading {self.file_path}: {e}")
                self.documents = []
        else:
            self.documents = []

    def _save(self):
        try:
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(self.documents, f, indent=2, cls=JSONEncoder)
        except Exception as e:
            logger.warning(f"Error saving {self.file_path}: {e}")

    def insert_one(self, doc):
        doc = dict(doc)
        if "_id" not in doc:
            doc["_id"] = str(ObjectId())
        elif isinstance(doc["_id"], ObjectId):
            doc["_id"] = str(doc["_id"])
        
        # Serialize datetime if needed
        for k, v in doc.items():
            if isinstance(v, datetime):
                doc[k] = v.isoformat()
                
        self.documents.append(doc)
        self._save()
        
        class InsertResult:
            inserted_id = doc["_id"]
        return InsertResult()

    def find_one(self, filter_dict=None):
        if not filter_dict:
            return self.documents[0] if self.documents else None
        for doc in self.documents:
            match = True
            for k, v in filter_dict.items():
                if k == "_id" and isinstance(v, ObjectId):
                    v = str(v)
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    def find(self, filter_dict=None):
        docs = []
        filter_dict = filter_dict or {}
        for doc in self.documents:
            match = True
            for k, v in filter_dict.items():
                if k == "_id" and isinstance(v, ObjectId):
                    v = str(v)
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                docs.append(dict(doc))
        
        class Cursor:
            def __init__(self, data):
                self._data = data
            def sort(self, key, direction=-1):
                reverse = direction == -1 or direction == pymongo.DESCENDING
                self._data.sort(key=lambda x: x.get(key, ""), reverse=reverse)
                return self
            def limit(self, n):
                self._data = self._data[:n]
                return self
            def __iter__(self):
                return iter(self._data)
            def list(self):
                return list(self._data)

        return Cursor(docs)

    def update_one(self, filter_dict, update_dict):
        target = self.find_one(filter_dict)
        if not target:
            return False
        
        for idx, doc in enumerate(self.documents):
            if doc.get("_id") == target.get("_id"):
                if "$set" in update_dict:
                    for k, v in update_dict["$set"].items():
                        if isinstance(v, datetime):
                            v = v.isoformat()
                        doc[k] = v
                else:
                    for k, v in update_dict.items():
                        if isinstance(v, datetime):
                            v = v.isoformat()
                        doc[k] = v
                self.documents[idx] = doc
                self._save()
                return True
        return False

    def count_documents(self, filter_dict=None):
        return len(list(self.find(filter_dict)))

    def delete_one(self, filter_dict):
        target = self.find_one(filter_dict)
        if not target:
            return False
        self.documents = [d for d in self.documents if d.get("_id") != target.get("_id")]
        self._save()
        return True


class MongoDatabaseManager:
    """Singleton MongoDB client with graceful local fallback support."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDatabaseManager, cls).__new__(cls)
            cls._instance._init_connection()
        return cls._instance

    def _init_connection(self):
        self.is_connected = False
        self.client = None
        self.db = None
        self.fallback_collections = {}
        
        try:
            # 1.5s timeout check for MongoDB connection
            self.client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=1500)
            self.client.admin.command('ping')
            self.db = self.client[DB_NAME]
            self.is_connected = True
            logger.info(f"Successfully connected to MongoDB at {MONGODB_URI}")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            self.is_connected = False
            logger.info(f"MongoDB not reachable ({e}). Initializing high-fidelity fallback repository.")

    def get_collection(self, collection_name: str):
        if self.is_connected and self.db is not None:
            return self.db[collection_name]
        
        if collection_name not in self.fallback_collections:
            self.fallback_collections[collection_name] = FallbackCollection(collection_name)
        return self.fallback_collections[collection_name]

# Helper singleton getter
db_manager = MongoDatabaseManager()

def get_db_collection(name: str):
    return db_manager.get_collection(name)

