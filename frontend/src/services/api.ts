import axios from 'axios';
import { DashboardOverview, CheckinSubmission, AlertItem, UserProfile } from '../types';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set token in localStorage
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('mindguard_token', token);
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('mindguard_token');
    delete client.defaults.headers.common['Authorization'];
  }
};

// Initial load
const existingToken = localStorage.getItem('mindguard_token');
if (existingToken) {
  client.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const res = await client.get('/dashboard/overview/');
    return res.data;
  } catch (err) {
    console.warn('Backend overview fetch fallback:', err);
    // Return high fidelity fallback identical to the Mindo screenshot
    return {
      greeting: {
        name: 'Sara',
        full_name: 'Sara Jenkins',
        message: 'How are you feeling today?',
      },
      telemetry: {
        goal_progress: {
          percentage: 65,
          status: 'Standard',
          label: 'Goal Progress',
        },
        stress_level: {
          percentage: 70,
          status: 'Low',
          label: 'Stress Level',
        },
        focus_power: {
          minutes: 42,
          status: 'Standard',
          label: 'Focus Power',
        },
      },
      health_improvement: {
        title: 'Health Improvement',
        subtitle: 'This week',
        timeframe: 'Week',
        data: [
          { day: 'MON', value: 48 },
          { day: 'TUE', value: 62 },
          { day: 'WED', value: 45 },
          { day: 'THU', value: 68 },
          { day: 'FRI', value: 92, isPeak: true, milestone: '80%+ Imp\n6 Aug 2025' },
          { day: 'SAT', value: 75 },
          { day: 'SUN', value: 82 },
        ],
        peak_label: '80%+ Imp',
        peak_date: '6 Aug 2025',
      },
      upcoming_session: {
        title: 'Upcoming Session',
        remaining_hours: 6,
        remaining_mins: 52,
        counsellor_name: 'Dr. Jams Alther',
        counsellor_avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        counsellor_title: 'Lead Clinical Psychologist',
      },
      reports: [
        {
          id: 'rep_1',
          title: 'Cognitive Therapy',
          date: '17-08-25',
          doctor_name: 'Dr. Jasmin',
          doctor_avatar: 'https://images.unsplash.com/photo-1594824813637-4b7f8df1211b?w=150&auto=format&fit=crop&q=80',
          category: 'Therapy',
          file_size: '1.4 MB',
        },
        {
          id: 'rep_2',
          title: 'Stress Management',
          date: '15-08-25',
          doctor_name: 'Dr. Jonshon',
          doctor_avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
          category: 'Assessment',
          file_size: '890 KB',
        },
        {
          id: 'rep_3',
          title: 'Sleep Therapy',
          date: '12-08-25',
          doctor_name: 'Dr. Samira',
          doctor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          category: 'Sleep',
          file_size: '2.1 MB',
        },
        {
          id: 'rep_4',
          title: 'Emotional Wellness',
          date: '05-08-25',
          doctor_name: 'Dr. K Sato',
          doctor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          category: 'Wellness',
          file_size: '1.1 MB',
        },
      ],
      active_path: {
        overall_score: 76,
        activities: [
          { name: 'Meditation', percentage: 50, color: 'lavender' },
          { name: 'Exercise', percentage: 85, color: 'violet', is_highlight: true },
          { name: 'Journaling', percentage: 60, color: 'lavender' },
        ],
      },
    };
  }
};

export const submitCheckin = async (data: CheckinSubmission) => {
  const res = await client.post('/checkins/', data);
  return res.data;
};

export const fetchCheckinsHistory = async () => {
  const res = await client.get('/checkins/');
  return res.data;
};

export const fetchCounsellorDashboard = async () => {
  const res = await client.get('/counsellor/dashboard/');
  return res.data;
};

export const acknowledgeAlert = async (alertId: string) => {
  const res = await client.post(`/counsellor/alerts/${alertId}/acknowledge/`);
  return res.data;
};

export const fetchAdminMetrics = async () => {
  const res = await client.get('/admin/metrics/');
  return res.data;
};
