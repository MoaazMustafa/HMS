'use client';

import {
  FileText,
  Search,
  Download,
  Filter,
  Calendar,
  User,
  Activity,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string | null;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (response.ok) {
        const data: AuditLogsResponse = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'UPDATE':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'DELETE':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'LOGIN':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Track all system activities and changes
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs..."
              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-background border-border text-foreground focus:ring-primary rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:outline-none">
              <option value="ALL">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-card border-border overflow-hidden rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-border border-b">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Timestamp
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    User
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Action
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Resource
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Details
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <div>
                          <p className="text-foreground text-xs font-medium">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <p className="text-foreground text-sm">
                          {log.userName || 'Unknown User'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${getActionBadgeColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Activity className="text-muted-foreground h-4 w-4" />
                        <p className="text-foreground text-sm">
                          {log.resource}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-muted-foreground max-w-md truncate text-xs">
                        {log.details}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-muted-foreground font-mono text-xs">
                        {log.ipAddress}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
