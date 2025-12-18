'use client';

import { Lock, Shield, Key, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage system security and access control
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-card rounded-lg border border-green-500/20 p-4">
          <Shield className="mb-2 h-8 w-8 text-green-500" />
          <p className="text-foreground text-sm font-medium">Firewall</p>
          <p className="text-muted-foreground text-xs">Active</p>
        </div>
        <div className="bg-card rounded-lg border border-green-500/20 p-4">
          <Lock className="mb-2 h-8 w-8 text-green-500" />
          <p className="text-foreground text-sm font-medium">SSL Certificate</p>
          <p className="text-muted-foreground text-xs">Valid until Dec 2026</p>
        </div>
        <div className="bg-card rounded-lg border border-yellow-500/20 p-4">
          <AlertTriangle className="mb-2 h-8 w-8 text-yellow-500" />
          <p className="text-foreground text-sm font-medium">Failed Logins</p>
          <p className="text-muted-foreground text-xs">3 in last 24h</p>
        </div>
      </div>

      {/* Security Actions */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Security Actions
        </h2>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Key className="h-4 w-4" />
            Rotate API Keys
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Shield className="h-4 w-4" />
            Force Password Reset
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Lock className="h-4 w-4" />
            Review Access Logs
          </Button>
        </div>
      </div>
    </div>
  );
}
