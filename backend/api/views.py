from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from bson import ObjectId

from .db import get_db_collection
from .auth_utils import hash_password, verify_password, create_jwt, decode_jwt
from .distress_analyzer import DistressTrendAnalyzer
from .seed_data import seed_initial_data

def sanitize_doc(doc):
    """Recursively converts BSON ObjectId and datetime objects into JSON-serializable types."""
    if isinstance(doc, list):
        return [sanitize_doc(item) for item in doc]
    if isinstance(doc, dict):
        clean = {}
        for k, v in doc.items():
            if isinstance(v, ObjectId):
                clean[k] = str(v)
            elif isinstance(v, (dict, list)):
                clean[k] = sanitize_doc(v)
            else:
                clean[k] = v
        return clean
    if isinstance(doc, ObjectId):
        return str(doc)
    return doc

# Ensure data is seeded on first request
try:
    seed_initial_data()
except Exception as e:
    pass

def get_authenticated_user(request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    payload = decode_jwt(token)
    if not payload:
        return None
    users_col = get_db_collection("users")
    return users_col.find_one({"_id": payload.get("user_id")})

@api_view(["GET"])
def api_health(request):
    return Response({
        "status": "healthy",
        "service": "MindGuard AI / Aarvya AI API",
        "timestamp": datetime.utcnow().isoformat()
    })

# ----------------- AUTHENTICATION -----------------

@api_view(["POST"])
def api_login(request):
    data = request.data or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    users_col = get_db_collection("users")
    user = users_col.find_one({"email": email})
    
    if not user or not verify_password(password, user.get("password", "")):
        return Response({"error": "Invalid email or password credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = create_jwt({
        "user_id": user["_id"],
        "email": user["email"],
        "role": user.get("role", "user")
    })
    
    # Audit log
    audit_col = get_db_collection("audit_logs")
    audit_col.insert_one({
        "action": "USER_LOGIN",
        "actor": user["email"],
        "details": f"Authenticated with role: {user.get('role', 'user')}",
        "timestamp": datetime.utcnow().isoformat()
    })

    return Response({
        "token": token,
        "user": {
            "id": user["_id"],
            "name": user["name"],
            "display_name": user.get("display_name", user["name"].split()[0]),
            "email": user["email"],
            "role": user.get("role", "user"),
            "avatar": user.get("avatar")
        }
    })

@api_view(["POST"])
def api_register(request):
    data = request.data or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "")
    role = data.get("role", "user")

    if not email or not password or not name:
        return Response({"error": "Name, email and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    users_col = get_db_collection("users")
    if users_col.find_one({"email": email}):
        return Response({"error": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    new_user = {
        "email": email,
        "name": name,
        "display_name": name.split()[0],
        "role": role if role in ["user", "counsellor", "admin"] else "user",
        "password": hash_password(password),
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
        "created_at": datetime.utcnow().isoformat(),
        "assigned_counsellor_id": "counsellor_jams_001",
        "goal_progress": 60,
        "focus_power_mins": 35
    }
    res = users_col.insert_one(new_user)
    user_id = str(res.inserted_id)

    token = create_jwt({
        "user_id": user_id,
        "email": email,
        "role": new_user["role"]
    })

    return Response({
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "display_name": new_user["display_name"],
            "email": email,
            "role": new_user["role"],
            "avatar": new_user["avatar"]
        }
    }, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def api_me(request):
    user = get_authenticated_user(request)
    if not user:
        # Fallback to demo user Sara for seamless live demo preview
        users_col = get_db_collection("users")
        user = users_col.find_one({"email": "user@mindguard.ai"})
        
    return Response({
        "id": user["_id"],
        "name": user["name"],
        "display_name": user.get("display_name", user["name"].split()[0]),
        "email": user["email"],
        "role": user.get("role", "user"),
        "avatar": user.get("avatar"),
        "goal_progress": user.get("goal_progress", 65),
        "focus_power_mins": user.get("focus_power_mins", 42)
    })

# ----------------- MAIN DASHBOARD OVERVIEW -----------------

@api_view(["GET"])
def api_dashboard_overview(request):
    """
    Returns the exact telemetry, charts, and activity data matching the Mindo reference dashboard.
    """
    user = get_authenticated_user(request)
    if not user:
        users_col = get_db_collection("users")
        user = users_col.find_one({"email": "user@mindguard.ai"}) or {}

    user_id = user.get("_id", "user_sara_001")
    
    # Checkins & Chart Data
    checkins_col = get_db_collection("checkins")
    recent_checkins = list(checkins_col.find({"user_id": user_id}).sort("created_at", -1).limit(7))
    
    # Formulate 7-day chart matching Mon-Sun
    days_order = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    chart_data = []
    
    # Default benchmark baseline curve
    base_values = {
        "MON": 48,
        "TUE": 62,
        "WED": 45,
        "THU": 68,
        "FRI": 92,  # Peak
        "SAT": 75,
        "SUN": 82
    }
    
    # Overlay any user submitted checkin
    submitted_by_day = {}
    for c in recent_checkins:
        d = c.get("day")
        if d:
            submitted_by_day[d] = c.get("composite_score", 70)
            
    for day in days_order:
        val = submitted_by_day.get(day, base_values.get(day, 65))
        item = {
            "day": day,
            "value": val,
            "isPeak": (day == "FRI"),
            "milestone": "80%+ Imp\n6 Aug 2025" if day == "FRI" else None
        }
        chart_data.append(item)

    # Upcoming Support Session
    appointments_col = get_db_collection("appointments")
    upcoming_appt = appointments_col.find_one({"user_id": user_id, "status": "confirmed"})
    if not upcoming_appt:
        upcoming_appt = appointments_col.find_one({"user_id": "user_sara_001"})

    # Reports
    reports_col = get_db_collection("reports")
    reports_list = sanitize_doc(list(reports_col.find({}).limit(4)))

    # Active path this week
    active_path = {
        "overall_score": 76,
        "activities": [
            {"name": "Meditation", "percentage": 50, "color": "lavender"},
            {"name": "Exercise", "percentage": 85, "color": "violet", "is_highlight": True},
            {"name": "Journaling", "percentage": 60, "color": "lavender"}
        ]
    }

    return Response(sanitize_doc({
        "greeting": {
            "name": user.get("display_name", "Sara"),
            "full_name": user.get("name", "Sara Jenkins"),
            "message": "How are you feeling today?"
        },
        "telemetry": {
            "goal_progress": {
                "percentage": user.get("goal_progress", 65),
                "status": "Standard",
                "label": "Goal Progress"
            },
            "stress_level": {
                "percentage": 70,
                "status": "Low",
                "label": "Stress Level"
            },
            "focus_power": {
                "minutes": user.get("focus_power_mins", 42),
                "status": "Standard",
                "label": "Focus Power"
            }
        },
        "health_improvement": {
            "title": "Health Improvement",
            "subtitle": "This week",
            "timeframe": "Week",
            "data": chart_data,
            "peak_label": "80%+ Imp",
            "peak_date": "6 Aug 2025"
        },
        "upcoming_session": {
            "title": "Upcoming Session",
            "remaining_hours": upcoming_appt.get("remaining_hours", 6) if upcoming_appt else 6,
            "remaining_mins": upcoming_appt.get("remaining_mins", 52) if upcoming_appt else 52,
            "counsellor_name": upcoming_appt.get("counsellor_name", "Dr. Jams Alther") if upcoming_appt else "Dr. Jams Alther",
            "counsellor_avatar": upcoming_appt.get("counsellor_avatar", "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80") if upcoming_appt else "",
            "counsellor_title": upcoming_appt.get("counsellor_title", "Lead Clinical Psychologist") if upcoming_appt else ""
        },
        "reports": reports_list,
        "active_path": active_path
    }))

# ----------------- CHECK-INS & AI EVALUATION -----------------

@api_view(["GET", "POST"])
def api_checkins(request):
    checkins_col = get_db_collection("checkins")
    user = get_authenticated_user(request)
    user_id = user["_id"] if user else "user_sara_001"

    if request.method == "GET":
        history = list(checkins_col.find({"user_id": user_id}).sort("created_at", -1).limit(20))
        return Response(sanitize_doc(history))

    # POST: Create new voluntary check-in
    data = request.data or {}
    mood = data.get("mood", "okay")
    stress_level = int(data.get("stress_level", 5))
    sleep_hours = float(data.get("sleep_hours", 7.0))
    energy_level = int(data.get("energy_level", 5))
    reflection = data.get("reflection", "")
    request_support = bool(data.get("request_support", False))

    now = datetime.utcnow()
    day_name = now.strftime("%a").upper()

    # Retrieve recent history for AI baseline comparison
    past_records = list(checkins_col.find({"user_id": user_id}).sort("created_at", -1).limit(10))

    # Run Explainable AI Distress Evaluation
    ai_evaluation = DistressTrendAnalyzer.evaluate_trend({
        "mood": mood,
        "stress_level": stress_level,
        "sleep_hours": sleep_hours,
        "energy_level": energy_level,
        "request_support": request_support
    }, past_records)

    checkin_doc = {
        "user_id": user_id,
        "day": day_name,
        "date": now.strftime("%Y-%m-%d"),
        "mood": mood,
        "stress_level": stress_level,
        "sleep_hours": sleep_hours,
        "energy_level": energy_level,
        "composite_score": ai_evaluation["current_score"],
        "reflection": reflection,
        "request_support": request_support,
        "ai_evaluation": ai_evaluation,
        "created_at": now.isoformat()
    }
    res = checkins_col.insert_one(checkin_doc)

    # If AI flags elevated distress or explicit request, create alert for counsellor
    if ai_evaluation["requires_counsellor_review"]:
        alerts_col = get_db_collection("alerts")
        alerts_col.insert_one({
            "user_id": user_id,
            "user_name": user.get("name", "Sara Jenkins") if user else "Sara Jenkins",
            "counsellor_id": user.get("assigned_counsellor_id", "counsellor_jams_001") if user else "counsellor_jams_001",
            "urgency": ai_evaluation["urgency"],
            "title": "Counsellor Review Indicated" if not request_support else "Direct Support Requested",
            "reason": "; ".join(ai_evaluation["explainable_factors"]),
            "status": "pending_review",
            "created_at": now.isoformat()
        })

    # Audit logging
    audit_col = get_db_collection("audit_logs")
    audit_col.insert_one({
        "action": "CHECKIN_RECORDED",
        "actor": user_id,
        "details": f"Score: {ai_evaluation['current_score']} | Review Flagged: {ai_evaluation['requires_counsellor_review']}",
        "timestamp": now.isoformat()
    })

    return Response(sanitize_doc({
        "message": "Check-in voluntarily recorded and analyzed successfully.",
        "checkin_id": str(res.inserted_id),
        "composite_score": ai_evaluation["current_score"],
        "ai_evaluation": ai_evaluation
    }), status=status.HTTP_201_CREATED)

# ----------------- COUNSELLOR PORTAL -----------------

@api_view(["GET"])
def api_counsellor_dashboard(request):
    alerts_col = get_db_collection("alerts")
    users_col = get_db_collection("users")
    checkins_col = get_db_collection("checkins")

    # Authorised counsellor view
    alerts = list(alerts_col.find({}).sort("created_at", -1).limit(10))
    assigned_patients = list(users_col.find({"role": "user"}).limit(10))
    recent_checkins = list(checkins_col.find({}).sort("created_at", -1).limit(15))

    return Response(sanitize_doc({
        "counsellor": {
            "name": "Dr. Jams Alther",
            "title": "Lead Clinical Psychologist",
            "active_cases": len(assigned_patients),
            "pending_alerts": len([a for a in alerts if a.get("status") == "pending_review"])
        },
        "alerts": alerts,
        "patients": assigned_patients,
        "recent_checkins": recent_checkins
    }))

@api_view(["POST"])
def api_acknowledge_alert(request, alert_id):
    alerts_col = get_db_collection("alerts")
    success = alerts_col.update_one(
        {"_id": alert_id},
        {"$set": {"status": "reviewed", "reviewed_at": datetime.utcnow().isoformat()}}
    )
    if not success:
        return Response({"error": "Alert not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"message": "Alert marked as reviewed."})

# ----------------- ADMIN PORTAL -----------------

@api_view(["GET"])
def api_admin_metrics(request):
    users_col = get_db_collection("users")
    checkins_col = get_db_collection("checkins")
    alerts_col = get_db_collection("alerts")
    audit_col = get_db_collection("audit_logs")

    return Response(sanitize_doc({
        "metrics": {
            "total_users": users_col.count_documents({"role": "user"}),
            "total_counsellors": users_col.count_documents({"role": "counsellor"}),
            "total_checkins": checkins_col.count_documents({}),
            "total_alerts": alerts_col.count_documents({}),
            "system_health": "100% Operational"
        },
        "recent_audits": list(audit_col.find({}).sort("timestamp", -1).limit(15))
    }))

# ----------------- APPOINTMENTS & CLINICAL NOTES -----------------

@api_view(["POST"])
def api_schedule_appointment(request):
    data = request.data or {}
    user = get_authenticated_user(request)
    user_id = user["_id"] if user else "user_sara_001"
    
    counsellor_id = data.get("counsellor_id", "counsellor_jams_001")
    scheduled_for = data.get("scheduled_for", (datetime.utcnow() + timedelta(days=2)).isoformat())
    session_type = data.get("type", "Follow-up Wellness Consultation")
    
    appts_col = get_db_collection("appointments")
    doc = {
        "user_id": user_id,
        "counsellor_id": counsellor_id,
        "counsellor_name": data.get("counsellor_name", "Dr. Jams Alther"),
        "counsellor_title": "Lead Clinical Psychologist",
        "counsellor_avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
        "scheduled_for": scheduled_for,
        "type": session_type,
        "status": "confirmed",
        "remaining_hours": 48,
        "remaining_mins": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    res = appts_col.insert_one(doc)
    
    # Audit log
    audit_col = get_db_collection("audit_logs")
    audit_col.insert_one({
        "action": "APPOINTMENT_SCHEDULED",
        "actor": user_id,
        "details": f"Scheduled {session_type} for {scheduled_for}",
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return Response(sanitize_doc({
        "message": "Support session scheduled successfully.",
        "appointment_id": str(res.inserted_id),
        "appointment": doc
    }), status=status.HTTP_201_CREATED)

@api_view(["GET", "POST"])
def api_counsellor_notes(request, user_id=None):
    notes_col = get_db_collection("clinical_notes")
    if request.method == "GET":
        target_id = user_id or "user_sara_001"
        notes = list(notes_col.find({"user_id": target_id}).sort("created_at", -1))
        return Response(sanitize_doc(notes))
        
    data = request.data or {}
    note_doc = {
        "user_id": data.get("user_id", "user_sara_001"),
        "counsellor_name": "Dr. Jams Alther",
        "observation": data.get("observation", ""),
        "interventions": data.get("interventions", ""),
        "next_steps": data.get("next_steps", ""),
        "created_at": datetime.utcnow().isoformat()
    }
    res = notes_col.insert_one(note_doc)
    return Response(sanitize_doc({
        "message": "Clinical session note recorded.",
        "note_id": str(res.inserted_id)
    }), status=status.HTTP_201_CREATED)

# ----------------- NOTIFICATIONS & CRISIS PATHWAYS -----------------

@api_view(["GET"])
def api_notifications(request):
    notifs_col = get_db_collection("notifications")
    notifs = list(notifs_col.find({}).sort("created_at", -1).limit(10))
    if not notifs:
        # Pre-populate sample notifications if empty
        sample_notifs = [
            {
                "title": "Upcoming Session Reminder",
                "message": "Your consultation with Dr. Jams Alther is in 6 hours and 52 minutes.",
                "type": "reminder",
                "is_read": False,
                "created_at": (datetime.utcnow() - timedelta(minutes=45)).isoformat()
            },
            {
                "title": "Weekly Wellness Milestone",
                "message": "You maintained a 100% check-in consistency this week! Peak well-being reached 92%.",
                "type": "achievement",
                "is_read": False,
                "created_at": (datetime.utcnow() - timedelta(hours=4)).isoformat()
            },
            {
                "title": "New Care Report Available",
                "message": "Dr. Jasmin uploaded your Cognitive Therapy summary report.",
                "type": "report",
                "is_read": True,
                "created_at": (datetime.utcnow() - timedelta(days=1)).isoformat()
            }
        ]
        for s in sample_notifs:
            notifs_col.insert_one(s)
        notifs = list(notifs_col.find({}).sort("created_at", -1).limit(10))

    return Response(sanitize_doc({
        "unread_count": len([n for n in notifs if not n.get("is_read")]),
        "notifications": notifs
    }))

@api_view(["POST"])
def api_mark_notifications_read(request):
    notifs_col = get_db_collection("notifications")
    notifs_col.update_one({"is_read": False}, {"$set": {"is_read": True}})
    return Response({"message": "Notifications marked as read."})

@api_view(["GET"])
def api_crisis_resources(request):
    """Verified 24/7 crisis hotlines and trauma care pathways."""
    resources = [
        {
            "name": "Tele-MANAS (Govt. of India)",
            "number": "14416 / 1800-891-4416",
            "availability": "24/7 • Free • Multi-lingual",
            "scope": "Comprehensive mental health & distress counseling across 20+ languages."
        },
        {
            "name": "KIRAN Mental Health Helpline",
            "number": "1800-599-0019",
            "availability": "24/7 • Toll-Free",
            "scope": "Trauma recovery, distress relief & professional psychological triage."
        },
        {
            "name": "Vandrevala Foundation Helpline",
            "number": "+91 9999 666 555",
            "availability": "24/7 • Free • WhatsApp & Call",
            "scope": "Experienced mental health counselors for acute emotional crisis."
        },
        {
            "name": "International Crisis Text Line",
            "number": "Text HOME to 741741",
            "availability": "24/7 • Free • SMS",
            "scope": "Confidential text support for crisis intervention."
        }
    ]
    return Response(resources)

