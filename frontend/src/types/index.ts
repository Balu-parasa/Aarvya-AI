export interface UserProfile {
  id: string;
  name: string;
  display_name: string;
  email: string;
  role: 'user' | 'counsellor' | 'admin';
  avatar?: string;
  goal_progress?: number;
  focus_power_mins?: number;
}

export interface TelemetryItem {
  percentage?: number;
  minutes?: number;
  status: string;
  label: string;
}

export interface ChartPoint {
  day: string;
  value: number;
  isPeak?: boolean;
  milestone?: string | null;
}

export interface ReportItem {
  id: string;
  title: string;
  date: string;
  doctor_name: string;
  doctor_avatar: string;
  category: string;
  file_size?: string;
}

export interface UpcomingSession {
  title: string;
  remaining_hours: number;
  remaining_mins: number;
  counsellor_name: string;
  counsellor_avatar: string;
  counsellor_title?: string;
}

export interface ActiveActivity {
  name: string;
  percentage: number;
  color: 'lavender' | 'violet';
  is_highlight?: boolean;
}

export interface DashboardOverview {
  greeting: {
    name: string;
    full_name: string;
    message: string;
  };
  telemetry: {
    goal_progress: TelemetryItem;
    stress_level: TelemetryItem;
    focus_power: TelemetryItem;
  };
  health_improvement: {
    title: string;
    subtitle: string;
    timeframe: string;
    data: ChartPoint[];
    peak_label: string;
    peak_date: string;
  };
  upcoming_session: UpcomingSession;
  reports: ReportItem[];
  active_path: {
    overall_score: number;
    activities: ActiveActivity[];
  };
}

export interface CheckinSubmission {
  mood: 'great' | 'good' | 'okay' | 'low' | 'distressed';
  stress_level: number;
  sleep_hours: number;
  energy_level: number;
  reflection?: string;
  request_support?: boolean;
}

export interface AlertItem {
  _id: string;
  user_id: string;
  user_name: string;
  counsellor_id: string;
  urgency: 'low' | 'moderate' | 'high' | 'urgent';
  title: string;
  reason: string;
  status: 'pending_review' | 'reviewed';
  created_at: string;
}
