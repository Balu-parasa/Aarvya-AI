from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.api_health, name='api_health'),
    path('auth/login/', views.api_login, name='api_login'),
    path('auth/register/', views.api_register, name='api_register'),
    path('auth/me/', views.api_me, name='api_me'),
    path('dashboard/overview/', views.api_dashboard_overview, name='api_dashboard_overview'),
    path('checkins/', views.api_checkins, name='api_checkins'),
    path('counsellor/dashboard/', views.api_counsellor_dashboard, name='api_counsellor_dashboard'),
    path('counsellor/alerts/<str:alert_id>/acknowledge/', views.api_acknowledge_alert, name='api_acknowledge_alert'),
    path('counsellor/notes/', views.api_counsellor_notes, name='api_counsellor_notes'),
    path('counsellor/notes/<str:user_id>/', views.api_counsellor_notes, name='api_counsellor_notes_user'),
    path('appointments/schedule/', views.api_schedule_appointment, name='api_schedule_appointment'),
    path('notifications/', views.api_notifications, name='api_notifications'),
    path('notifications/mark-read/', views.api_mark_notifications_read, name='api_mark_notifications_read'),
    path('crisis-resources/', views.api_crisis_resources, name='api_crisis_resources'),
    path('admin/metrics/', views.api_admin_metrics, name='api_admin_metrics'),
]
