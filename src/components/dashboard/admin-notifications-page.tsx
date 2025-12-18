'use client';

import { Mail, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function AdminNotificationsPage() {
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

      <div className="bg-card border-border rounded-lg border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Create Notification
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Recipient Type
            </label>
            <select className="bg-background border-border text-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none">
              <option>All Users</option>
              <option>Doctors</option>
              <option>Nurses</option>
              <option>Patients</option>
            </select>
          </div>
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              placeholder="Notification title..."
              className="bg-background border-border text-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-foreground mb-2 block text-sm font-medium">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Notification message..."
              className="bg-background border-border text-foreground focus:ring-primary w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send Notification
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
