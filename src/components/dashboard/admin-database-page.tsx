'use client';

import { Database, HardDrive, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function AdminDatabasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Database Management
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Database backup, restore, and maintenance
        </p>
      </div>

      <div className="bg-card border-border rounded-lg border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Database className="text-primary h-5 w-5" />
          <h2 className="text-foreground text-lg font-semibold">
            Database Status
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Connection Status
            </span>
            <span className="text-sm font-medium text-green-500">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Database Size</span>
            <span className="text-foreground text-sm font-medium">2.4 GB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Last Backup</span>
            <span className="text-foreground text-sm font-medium">
              2 hours ago
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Button variant="outline" className="h-20 gap-2">
          <HardDrive className="h-5 w-5" />
          <span>Backup Now</span>
        </Button>
        <Button variant="outline" className="h-20 gap-2">
          <RefreshCw className="h-5 w-5" />
          <span>Restore</span>
        </Button>
        <Button variant="outline" className="h-20 gap-2">
          <Database className="h-5 w-5" />
          <span>Optimize</span>
        </Button>
      </div>
    </div>
  );
}
