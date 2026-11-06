# MindGuard AI (AARVYA AI)

**AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System for Victims of Atrocities.**

Designed in accordance with the **Mindo Mental Wellness** visual language (Lavender `#C8C1E3` / `#E9E2FF`, 3D realistic lavender brain, floating telemetry pills, Recharts wave analytics, and clean typography).

---

## Architecture Overview

```
Aarvya ai/
├── backend/                  # Django REST Framework + PyMongo
│   ├── api/
│   │   ├── db.py             # PyMongo MongoDB repository layer with graceful local fallback
│   │   ├── distress_analyzer.py # Explainable AI baseline & deviation analysis (Pandas/NumPy/Scikit-learn)
│   │   ├── auth_utils.py     # Cryptographic JWT & PBKDF2 hashing
│   │   ├── seed_data.py      # Pre-seeded users, clinical reports, sessions & metrics
│   │   ├── views.py          # REST endpoints for dashboard, checkins, counsellor triage & admin
│   │   └── urls.py
│   ├── config/               # Django project settings & URL router
│   └── manage.py
│
└── frontend/                 # React 19/18 + TypeScript + Vite + Tailwind CSS v4
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx             # Floating pill nav + role switcher
    │   │   ├── BrainVisualization.tsx # 3D lavender brain + floating telemetry pills + pointer line
    │   │   ├── HealthImprovementChart.tsx # Smooth Recharts wave with peak milestone badge
    │   │   ├── BottomSection.tsx      # Reports download list, Upcoming session countdown, Active path
    │   │   ├── DailyCheckinModal.tsx  # Voluntary check-in modal with confetti feedback
    │   │   ├── CounsellorPortal.tsx   # Licensed psychologist triage & alert review console
    │   │   ├── ProgressPage.tsx       # Historical check-in analytics
    │   │   ├── AdminPortal.tsx        # Tamper-evident audit trail & system metrics
    │   │   └── LandingPage.tsx        # Mission overview & ethical disclaimer
    │   ├── services/api.ts            # Axios API client with local resilience
    │   └── types/index.ts
    └── vite.config.ts
```

---

## Live Development Servers

- **Frontend**: `http://127.0.0.1:5173/`
- **Backend API**: `http://127.0.0.1:8000/api/`
  - Health check: `http://127.0.0.1:8000/api/health/`
  - Dashboard overview: `http://127.0.0.1:8000/api/dashboard/overview/`
  - Check-in history: `http://127.0.0.1:8000/api/checkins/`

---

## Demo Credentials & Role Switcher

You can switch roles directly from the avatar dropdown in the top-right corner of the navigation bar:

1. **Individual / Victim View**:
   - Name: Sara Jenkins
   - Email: `user@mindguard.ai`
   - Access to daily check-ins, personal telemetry, reports, upcoming support session.

2. **Counsellor Clinical View**:
   - Name: Dr. Jams Alther (Lead Clinical Psychologist)
   - Email: `jams@mindguard.ai`
   - Access to triage queue, explainable distress variance factors, and patient records.

3. **System Administrator View**:
   - Email: `admin@mindguard.ai`
   - Access to system metrics and tamper-evident audit logs.

---

## Ethical Non-Clinical Disclaimer
MindGuard AI is built for supportive monitoring and human-centred triage, not autonomous psychiatric diagnosis or clinical decision-making.

