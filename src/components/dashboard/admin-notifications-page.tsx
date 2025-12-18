'use client';

import { Mail, Send, CheckCircle, AlertCircle, Bell, Clock } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function AdminNotificationsPage() {
  const [recipientType, setRecipientType] = useState('ALL');
  const [notificationType, setNotificationType] = useState('SYSTEM');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      setResult({ type: 'error', message: 'Title and message are required' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientType,
          type: notificationType,
          title: title.trim(),
          message: message.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          type: 'success',
          message: `Notification sent to ${data.count} users successfully!`,
        });
        setTitle('');
        setMessage('');
      } else {
        const error = await response.json();
        setResult({
          type: 'error',
          message: error.error || 'Failed to send notification',
        });
      }
    } catch {
      setResult({
        type: 'error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const quickTemplates = [
    {
      title: 'System Maintenance',
      message: 'The system will undergo scheduled maintenance on [DATE] from [TIME] to [TIME]. Please save your work.',
      type: 'GENERAL',
    },
    {
      title: 'New Feature Available',
      message: 'We have added new features to improve your experience. Check them out in the dashboard.',
      type: 'GENERAL',
    },
    {
      title: 'Appointment Reminder',
      message: 'This is a reminder for your upcoming appointment on [DATE] at [TIME].',
      type: 'APPOINTMENT_REMINDER',
    },
    {
      title: 'Lab Results Ready',
      message: 'Your lab results are now available. Please check your medical records.',
      type: 'LAB_RESULT_AVAILABLE',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Notifications Center
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Send system-wide notifications to users
        </p>
      </div>

      {/* Result Alert */}
      {result && (
        <div
          className={`rounded-lg border p-4 ${
            result.type === 'success'
              ? 'border-green-500/20 bg-green-500/10'
              : 'border-red-500/20 bg-red-500/10'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <p
              className={`text-sm font-medium ${
                result.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {result.message}
            </p>
          </div>
        </div>
      )}

      {/* Create Notification Form */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Create Notification
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Recipient Type *
              </label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="bg-background border-border text-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="ALL">All Users</option>
                <option value="DOCTOR">Doctors Only</option>
                <option value="NURSE">Nurses Only</option>
                <option value="PATIENT">Patients Only</option>
                <option value="ADMIN">Admins Only</option>
              </select>
            </div>
            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Notification Type
              </label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="bg-background border-border text-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="GENERAL">General</option>
                <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
                <option value="APPOINTMENT_CONFIRMATION">Appointment Confirmation</option>
                <option value="APPOINTMENT_CANCELLATION">Appointment Cancellation</option>
                <option value="PRESCRIPTION_CHANGE">Prescription Change</option>
                <option value="LAB_RESULT_AVAILABLE">Lab Result Available</option>
                <option value="CRITICAL_LAB_VALUE">Critical Lab Value</option>
                <option value="SESSION_REMINDER">Session Reminder</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title..."
              maxLength={100}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Notification message..."
              maxLength={500}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              {message.length}/500 characters
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSendNotification}
              disabled={sending || !title.trim() || !message.trim()}
              className="gap-2"
            >
              {sending ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Notification
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTitle('');
                setMessage('');
                setResult(null);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Quick Templates
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {quickTemplates.map((template, index) => (
            <div
              key={index}
              className="border-border rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mb-2 flex items-center gap-2">
                <Bell className="text-primary h-4 w-4" />
                <h3 className="text-foreground text-sm font-semibold">
                  {template.title}
                </h3>
              </div>
              <p className="text-muted-foreground mb-3 text-xs">
                {template.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTitle(template.title);
                  setMessage(template.message);
                  setNotificationType(template.type);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-card border-border rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <Bell className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Sent</p>
              <p className="text-foreground text-2xl font-bold">-</p>
            </div>
          </div>
        </div>
        <div className="bg-card border-border rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Delivered</p>
              <p className="text-foreground text-2xl font-bold">-</p>
            </div>
          </div>
        </div>
        <div className="bg-card border-border rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
              <Mail className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Read Rate</p>
              <p className="text-foreground text-2xl font-bold">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
