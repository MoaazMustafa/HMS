'use client';

import {
  Bell,
  Check,
  Trash2,
  CheckCheck,
  RefreshCw,
} from 'lucide-react';
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

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications?limit=100');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
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
      }
    } catch {
      // Silent fail
    }
  };

  const markAllAsRead = async () => {
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
      }
    } catch {
      // Silent fail
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
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
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PRESCRIPTION_CHANGE':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'LAB_RESULT_AVAILABLE':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'CRITICAL_LAB_VALUE':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'SESSION_REMINDER':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'GENERAL':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchNotifications}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {unreadCount > 0 && (
            <Button size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-card border-border flex gap-2 rounded-lg border p-1">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-card border-border flex min-h-[200px] flex-col items-center justify-center rounded-lg border p-8">
            <Bell className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground mb-2 text-sm font-medium">
              No notifications
            </p>
            <p className="text-muted-foreground text-xs">
              {filter === 'unread'
                ? "You're all caught up!"
                : 'Notifications will appear here'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card border-border group rounded-lg border p-4 transition-colors hover:shadow-md ${
                !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${getTypeColor(
                    notification.type
                  )}`}
                >
                  <Bell className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          {notification.type}
                        </span>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary"></span>
                        )}
                      </div>
                      <h3 className="text-foreground mb-1 text-sm font-semibold">
                        {notification.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {notification.message}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
