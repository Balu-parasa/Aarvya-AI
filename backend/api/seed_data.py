from datetime import datetime, timedelta
from .db import get_db_collection
from .auth_utils import hash_password

def seed_initial_data():
    users_col = get_db_collection("users")
    counsellors_col = get_db_collection("counsellors")
    checkins_col = get_db_collection("checkins")
    appointments_col = get_db_collection("appointments")
    reports_col = get_db_collection("reports")
    alerts_col = get_db_collection("alerts")
    audit_col = get_db_collection("audit_logs")

    if users_col.count_documents({}) > 0:
        return

    # 1. Demo User: Sara
    user_sara = {
        "_id": "user_sara_001",
        "email": "user@aarvya.ai",
        "name": "Sara Jenkins",
        "display_name": "Sara",
        "role": "user",
        "password": hash_password("pass123"),
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        "created_at": datetime.utcnow().isoformat(),
        "assigned_counsellor_id": "counsellor_jams_001",
        "goal_progress": 65,
        "focus_power_mins": 42
    }
    users_col.insert_one(user_sara)

    # 2. Demo Counsellors
    counsellors = [
        {
            "_id": "counsellor_jams_001",
            "email": "jams@aarvya.ai",
            "name": "Dr. Jams Alther",
            "role": "counsellor",
            "title": "Lead Clinical Psychologist",
            "specialization": "Trauma & Anxiety Recovery",
            "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
            "password": hash_password("pass123"),
            "assigned_patients_count": 8
        },
        {
            "_id": "counsellor_jasmin_002",
            "email": "jasmin@aarvya.ai",
            "name": "Dr. Jasmin",
            "role": "counsellor",
            "title": "CBT Specialist",
            "avatar": "https://images.unsplash.com/photo-1594824813637-4b7f8df1211b?w=150&auto=format&fit=crop&q=80",
            "password": hash_password("pass123"),
        },
        {
            "_id": "counsellor_jonshon_003",
            "email": "jonshon@aarvya.ai",
            "name": "Dr. Jonshon",
            "role": "counsellor",
            "title": "Stress & Burnout Consultant",
            "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
            "password": hash_password("pass123"),
        },
        {
            "_id": "counsellor_samira_004",
            "email": "samira@aarvya.ai",
            "name": "Dr. Samira",
            "role": "counsellor",
            "title": "Sleep & Circadian Rhythm Therapist",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "password": hash_password("pass123"),
        },
        {
            "_id": "counsellor_sato_005",
            "email": "sato@aarvya.ai",
            "name": "Dr. K Sato",
            "role": "counsellor",
            "title": "Emotional Resilience Specialist",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "password": hash_password("pass123"),
        }
    ]
    for c in counsellors:
        counsellors_col.insert_one(c)

    # 3. Demo Admin
    admin_user = {
        "_id": "admin_001",
        "email": "admin@aarvya.ai",
        "name": "Administrator",
        "display_name": "Admin",
        "role": "admin",
        "password": hash_password("admin123"),
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        "created_at": datetime.utcnow().isoformat()
    }
    users_col.insert_one(admin_user)

    # 4. Realistic Checkins for Sara over the week
    days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    values = [52, 60, 48, 70, 92, 75, 80]
    base_date = datetime.utcnow() - timedelta(days=6)
    
    for i, (day, val) in enumerate(zip(days, values)):
        dt = base_date + timedelta(days=i)
        checkins_col.insert_one({
            "user_id": "user_sara_001",
            "day": day,
            "date": dt.strftime("%Y-%m-%d"),
            "mood": "great" if val >= 80 else ("good" if val >= 60 else "okay"),
            "stress_level": 3 if val >= 80 else (5 if val >= 60 else 7),
            "sleep_hours": 7.5 if val >= 70 else 6.0,
            "energy_level": 8 if val >= 80 else 6,
            "composite_score": val,
            "reflection": "Feeling centered after morning breathing exercise." if i == 4 else "Steady routine.",
            "request_support": False,
            "created_at": dt.isoformat()
        })

    # 5. Upcoming Support Session with Dr. Jams Alther (6 hours 52 mins from now)
    session_time = datetime.utcnow() + timedelta(hours=6, minutes=52)
    appointments_col.insert_one({
        "user_id": "user_sara_001",
        "counsellor_id": "counsellor_jams_001",
        "counsellor_name": "Dr. Jams Alther",
        "counsellor_title": "Lead Clinical Psychologist",
        "counsellor_avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
        "scheduled_for": session_time.isoformat(),
        "type": "Follow-up Wellness Consultation",
        "status": "confirmed",
        "remaining_hours": 6,
        "remaining_mins": 52
    })

    # 6. Reports matching the screenshot
    reports = [
        {
            "id": "rep_1",
            "title": "Cognitive Therapy",
            "date": "17-08-25",
            "doctor_name": "Dr. Jasmin",
            "doctor_avatar": "https://images.unsplash.com/photo-1594824813637-4b7f8df1211b?w=150&auto=format&fit=crop&q=80",
            "category": "Therapy",
            "file_size": "1.4 MB"
        },
        {
            "id": "rep_2",
            "title": "Stress Management",
            "date": "15-08-25",
            "doctor_name": "Dr. Jonshon",
            "doctor_avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
            "category": "Assessment",
            "file_size": "890 KB"
        },
        {
            "id": "rep_3",
            "title": "Sleep Therapy",
            "date": "12-08-25",
            "doctor_name": "Dr. Samira",
            "doctor_avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "category": "Sleep",
            "file_size": "2.1 MB"
        },
        {
            "id": "rep_4",
            "title": "Emotional Wellness",
            "date": "05-08-25",
            "doctor_name": "Dr. K Sato",
            "doctor_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "category": "Wellness",
            "file_size": "1.1 MB"
        }
    ]
    for r in reports:
        reports_col.insert_one(r)

    # 7. Initial alerts for Counsellor review
    alerts_col.insert_one({
        "user_id": "user_sara_001",
        "user_name": "Sara Jenkins",
        "counsellor_id": "counsellor_jams_001",
        "urgency": "low",
        "title": "Check-in Routine Milestone",
        "reason": "Consistent 7-day voluntary tracking achieved with 80%+ positive momentum.",
        "status": "pending_review",
        "created_at": (datetime.utcnow() - timedelta(hours=3)).isoformat()
    })

    # 8. Audit logs
    audit_col.insert_one({
        "action": "SYSTEM_INITIALIZED",
        "actor": "System",
        "details": "Platform security policies, PyMongo collection schemas, and privacy guards activated.",
        "timestamp": datetime.utcnow().isoformat()
    })

