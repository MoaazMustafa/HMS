'use client';

import {
  Database,
  Table,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  Download,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/use-confirm';
import { useAlert } from '@/hooks/use-toast-alert';
import { exportData } from '@/lib/export';

interface TableInfo {
  name: string;
  rowCount: number;
  columns: string[];
}

export function AdminDatabaseManagePage() {
  const [tables, setTables] = useState<TableInfo[]>([
    {
      name: 'users',
      rowCount: 0,
      columns: ['id', 'email', 'name', 'role', 'createdAt'],
    },
    {
      name: 'patients',
      rowCount: 0,
      columns: ['id', 'userId', 'patientId', 'firstName', 'lastName'],
    },
    {
      name: 'doctors',
      rowCount: 0,
      columns: ['id', 'userId', 'specialization', 'licenseNumber'],
    },
    {
      name: 'nurses',
      rowCount: 0,
      columns: ['id', 'userId', 'department', 'licenseNumber'],
    },
    {
      name: 'appointments',
      rowCount: 0,
      columns: ['id', 'patientId', 'doctorId', 'scheduledDate', 'status'],
    },
    {
      name: 'prescriptions',
      rowCount: 0,
      columns: [
        'id',
        'patientId',
        'doctorId',
        'medicationName',
        'dosage',
        'isActive',
      ],
    },
    {
      name: 'lab_tests',
      rowCount: 0,
      columns: ['id', 'patientId', 'doctorId', 'testName', 'status'],
    },
    {
      name: 'medical_records',
      rowCount: 0,
      columns: ['id', 'patientId', 'doctorId', 'recordType', 'status'],
    },
  ]);
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { confirm, ConfirmDialog } = useConfirm();
  const { alert, AlertDialog } = useAlert();

  const fetchTableCounts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setTables((prev) =>
          prev.map((table) => {
            switch (table.name) {
              case 'users':
                return { ...table, rowCount: data.overview.totalUsers || 0 };
              case 'patients':
                return { ...table, rowCount: data.overview.totalPatients || 0 };
              case 'doctors':
                return { ...table, rowCount: data.overview.totalDoctors || 0 };
              case 'nurses':
                return { ...table, rowCount: data.overview.totalNurses || 0 };
              case 'appointments':
                return {
                  ...table,
                  rowCount: data.overview.totalAppointments || 0,
                };
              case 'prescriptions':
                return {
                  ...table,
                  rowCount: data.overview.activePrescriptions || 0,
                };
              default:
                return table;
            }
          }),
        );
      }
    } catch (error) {
      // Error fetching table counts
      void error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (tableName) {
        case 'users':
          endpoint = '/api/admin/users?limit=50';
          break;
        case 'patients':
          endpoint = '/api/admin/users?role=PATIENT&limit=50';
          break;
        case 'doctors':
          endpoint = '/api/admin/users?role=DOCTOR&limit=50';
          break;
        case 'nurses':
          endpoint = '/api/admin/users?role=NURSE&limit=50';
          break;
        default:
          setTableData([]);
          setLoading(false);
          return;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setTableData(data.users || []);
      }
    } catch (error) {
      // Error fetching table data
      void error;
      alert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load table data',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableCounts();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      void fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  const handleDeleteRow = async (id: string) => {
    const confirmed = await confirm({
      title: 'Delete Record',
      description:
        'Are you sure you want to delete this record? This action cannot be undone.',
      confirmText: 'Delete',
      variant: 'destructive',
    });

    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert({
            type: 'success',
            title: 'Success',
            message: 'Record deleted successfully',
          });
          void fetchTableData(selectedTable);
          void fetchTableCounts();
        } else {
          alert({
            type: 'error',
            title: 'Error',
            message: 'Failed to delete record',
          });
        }
      } catch {
        alert({
          type: 'error',
          title: 'Error',
          message: 'An error occurred while deleting',
        });
      }
    }
  };

  const handleExportTable = () => {
    if (tableData.length === 0) {
      alert({
        type: 'warning',
        title: 'No Data',
        message: 'No data available to export',
      });
      return;
    }

    const exportDataArray = tableData.map((row) => ({
      id: String(row.id),
      email: String(row.email || 'N/A'),
      name: String(row.name || 'N/A'),
      role: String(row.role || 'N/A'),
      createdAt: new Date(String(row.createdAt)).toLocaleDateString(),
    }));

    exportData(exportDataArray, `${selectedTable}_export`, 'csv');
    alert({
      type: 'success',
      title: 'Export Started',
      message: 'Your data export has started',
    });
  };

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-6">
      <ConfirmDialog />
      <AlertDialog />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Database Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View and manage database tables
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              void fetchTableCounts();
              void fetchTableData(selectedTable);
            }}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportTable}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tables Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tables.map((table) => (
          <div
            key={table.name}
            className={`bg-card border-border hover:border-primary cursor-pointer rounded-lg border p-4 transition-all ${
              selectedTable === table.name ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
            onClick={() => setSelectedTable(table.name)}
          >
            <div className="mb-3 flex items-center gap-2">
              <Table className="text-primary h-5 w-5" />
              <h3 className="text-foreground font-semibold capitalize">
                {table.name.replace(/_/g, ' ')}
              </h3>
            </div>
            <div className="text-muted-foreground text-sm">
              <p>{table.rowCount} rows</p>
              <p className="mt-1 text-xs">{table.columns.length} columns</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Data Viewer */}
      <div className="bg-card border-border rounded-lg border">
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <Database className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold capitalize">
              {selectedTable.replace(/_/g, ' ')}
            </h2>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Table className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground">No data found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50 border-border border-b">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    ID
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Email
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Name
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Role
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    Created At
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-xs font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {filteredData.map((row) => (
                  <tr key={String(row.id)} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <p className="text-foreground text-xs font-mono">
                        {String(row.id).slice(0, 8)}...
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground text-sm">{String(row.email)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground text-sm">
                        {String(row.name || 'N/A')}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {String(row.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-muted-foreground text-xs">
                        {new Date(String(row.createdAt)).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRow(String(row.id))}
                        >
                          <Trash2 className="text-destructive h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
