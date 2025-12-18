'use client';

import { Bell, Check, X, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // Silent fail
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // Silent fail
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            isRead: true,
            readAt: new Date().toISOString(),
          }))
        );
        setUnreadCount(0);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const wasUnread = notifications.find((n) => n.id === id)?.isRead === false;
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch {
      // Silent fail
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'APPOINTMENT_REMINDER':
      case 'APPOINTMENT_CONFIRMATION':
      case 'APPOINTMENT_CANCELLATION':
        return 'bg-blue-500/10 text-blue-500';
      case 'PRESCRIPTION_CHANGE':
        return 'bg-purple-500/10 text-purple-500';
      case 'LAB_RESULT_AVAILABLE':
        return 'bg-green-500/10 text-green-500';
      case 'CRITICAL_LAB_VALUE':
        return 'bg-red-500/10 text-red-500';
      case 'SESSION_REMINDER':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'GENERAL':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notification Dropdown */}
          <div className="absolute right-0 top-12 z-50 w-96 rounded-lg border border-border bg-card shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="text-foreground text-sm font-semibold">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs"
                >
                  <CheckCheck className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Bell className="text-muted-foreground mb-2 h-8 w-8" />
                  <p className="text-muted-foreground text-sm">
                    No notifications
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-border p-4 transition-colors hover:bg-muted/50 ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getTypeColor(
                              notification.type
                            )}`}
                          >
                            {notification.type}
                          </span>
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                        <h4 className="text-foreground mb-1 text-sm font-medium">
                          {notification.title}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          {notification.message}
                        </p>
                        <p className="text-muted-foreground mt-1 text-[10px]">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-2 flex gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border p-2 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/dashboard/notifications';
                  }}
                  className="text-primary hover:text-primary/80 text-xs font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
