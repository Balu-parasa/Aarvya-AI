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
    path('admin/metrics/', views.api_admin_metrics, name='api_admin_metrics'),
]
