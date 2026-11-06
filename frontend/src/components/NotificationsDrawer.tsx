import React from 'react';
import { Bell, CheckCheck, X, Clock, Award, FileText } from 'lucide-react';

interface NotificationItem {
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-4 h-4 text-[#7546F5]" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-[#A78BFA]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#DCD2FF] animate-slideLeft">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#F1ECFF]">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-2xl bg-[#F1ECFF] text-[#7546F5]">
                <Bell className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#242033]">
                  Activity Notifications
                </h3>
                <span className="text-[11px] text-[#858098]">
                  Real-time updates & session reminders
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F1ECFF] text-[#858098] hover:text-[#242033] flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between py-3">
            <span className="text-xs font-semibold text-[#858098]">
              {notifications.filter((n) => !n.is_read).length} New Alerts
            </span>
            <button
              onClick={onMarkAllRead}
              className="flex items-center space-x-1 text-xs text-[#7546F5] hover:text-[#6232e0] font-semibold"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 mt-1 overflow-y-auto max-h-[70vh] pr-1">
            {notifications.map((n, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  n.is_read
                    ? 'bg-white border-[#F1ECFF] opacity-75'
                    : 'bg-[#F8F5FF] border-[#DCD2FF] shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-[#242033]">{n.title}</h4>
                      <span className="text-[10px] text-[#858098]">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#858098] mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F1ECFF]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#F1ECFF] text-[#242033] text-xs font-semibold hover:bg-[#DCD2FF] transition-colors"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

