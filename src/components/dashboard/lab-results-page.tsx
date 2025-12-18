'use client';

import { motion } from 'framer-motion';
import {
  FlaskConical,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  User,
  Search,
  CheckCircle,
  Clock,
  FileText,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

type LabTest = {
  id: string;
  testId: string;
  testName: string;
  testType: string;
  results?: string;
  unit?: string;
  referenceRange?: string;
  status: string;
  isCritical: boolean;
  orderedAt: Date;
  completedAt?: Date;
  reviewedAt?: Date;
  notes?: string;
  doctor: {
    user: {
      name: string;
    };
    specialization: string;
  };
};

type Props = {
  labTests: LabTest[];
};

export function LabResultsPage({ labTests }: Props) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = labTests.filter((test) => {
    // Filter by status
    if (filter === 'completed' && test.status !== 'COMPLETED') return false;
    if (filter === 'pending' && test.status === 'COMPLETED') return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        test.testName.toLowerCase().includes(query) ||
        test.testType.toLowerCase().includes(query) ||
        test.testId.toLowerCase().includes(query) ||
        test.doctor.user.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-500 border-green-500/20';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-500 border-red-500/20';
      default:
        return 'bg-background-500/20 text-background-500 border-background-500/20';
    }
  };

  const isResultAbnormal = (results: string, referenceRange: string) => {
    // Simple check - in production, this would be more sophisticated
    if (!results || !referenceRange) return false;
    const numResult = parseFloat(results);
    if (isNaN(numResult)) return false;

    const match = referenceRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (match) {
      const min = parseFloat(match[1]);
      const max = parseFloat(match[2]);
      return numResult < min || numResult > max;
    }
    return false;
  };

  const completedTests = labTests.filter(
    (t) => t.status === 'COMPLETED',
  ).length;
  const pendingTests = labTests.filter(
    (t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS',
  ).length;
  const criticalResults = labTests.filter((t) => t.isCritical).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Lab Results
          </h1>
          <p className="text-background-400">
            View your laboratory test results and trends
          </p>
        </div>
      </div>

      {/* Critical Alert */}
      {criticalResults > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="mb-1 text-sm font-semibold text-red-400">
              {criticalResults} Critical Result{criticalResults > 1 ? 's' : ''}{' '}
              Detected
            </p>
            <p className="text-xs text-red-400/80">
              Please contact your healthcare provider immediately to discuss
              these results.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            label: 'Total Tests',
            value: labTests.length,
            icon: FlaskConical,
            color: 'text-blue-500',
          },
          {
            label: 'Completed',
            value: completedTests,
            icon: CheckCircle,
            color: 'text-green-500',
          },
          {
            label: 'Pending',
            value: pendingTests,
            icon: Clock,
            color: 'text-yellow-500',
          },
          {
            label: 'Critical',
            value: criticalResults,
            icon: AlertCircle,
            color: 'text-red-500',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-background-900/50 border-background-800 rounded-lg border p-6 backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-background-400 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-background-900/50 border-background-800 rounded-lg border p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() =>
                  setFilter(tab.value as 'all' | 'completed' | 'pending')
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-primary text-background'
                    : 'bg-background-800 text-background-400 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="text-background-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by test name, type, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background-800 border-background-700 text-foreground placeholder:text-background-500 focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Lab Tests List */}
      <div className="space-y-4">
        {filteredTests.length === 0 ? (
          <div className="bg-background-900/50 border-background-800 rounded-lg border p-12 text-center backdrop-blur-xl">
            <FlaskConical className="text-background-600 mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              No lab results found
            </h3>
            <p className="text-background-400">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'No lab tests available'}
            </p>
          </div>
        ) : (
          filteredTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-background-900/50 rounded-lg border p-6 backdrop-blur-xl transition-all ${
                test.isCritical
                  ? 'border-red-500/50 hover:border-red-500'
                  : 'border-background-800 hover:border-background-700'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-3">
                    <FlaskConical className="text-primary mt-1 h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-foreground text-lg font-semibold">
                          {test.testName}
                        </h3>
                        {test.isCritical && (
                          <span className="flex items-center gap-1 rounded border border-red-500/20 bg-red-500/20 px-2 py-1 text-xs font-medium text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <p className="text-background-400 mb-1 text-sm">
                        {test.testType}
                      </p>
                      <p className="text-background-500 font-mono text-xs">
                        Test ID: {test.testId}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium ${getStatusColor(
                        test.status,
                      )}`}
                    >
                      {test.status}
                    </span>
                    <Link href={`/dashboard/lab-results/${test.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Result Display */}
                {test.results && test.status === 'COMPLETED' && (
                  <div className="bg-background-800/50 rounded-lg p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-background-500 mb-1 text-xs">
                          Result
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-foreground text-xl font-bold">
                            {test.results}
                            {test.unit && (
                              <span className="text-background-400 ml-1 text-sm">
                                {test.unit}
                              </span>
                            )}
                          </p>
                          {test.referenceRange &&
                            isResultAbnormal(
                              test.results,
                              test.referenceRange,
                            ) && (
                              <>
                                {parseFloat(test.results) >
                                parseFloat(
                                  test.referenceRange.split('-')[1],
                                ) ? (
                                  <TrendingUp className="h-5 w-5 text-red-500" />
                                ) : (
                                  <TrendingDown className="h-5 w-5 text-red-500" />
                                )}
                              </>
                            )}
                        </div>
                      </div>
                      {test.referenceRange && (
                        <div>
                          <p className="text-background-500 mb-1 text-xs">
                            Reference Range
                          </p>
                          <p className="text-foreground font-medium">
                            {test.referenceRange}
                            {test.unit && (
                              <span className="text-background-400 ml-1 text-sm">
                                {test.unit}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-background-500 mb-1 text-xs">
                          Status
                        </p>
                        <p className="text-foreground font-medium">
                          {isResultAbnormal(
                            test.results,
                            test.referenceRange || '',
                          )
                            ? 'Abnormal'
                            : 'Normal'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {test.notes && (
                  <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <p className="text-sm text-blue-400">{test.notes}</p>
                  </div>
                )}

                {/* Details */}
                <div className="text-background-400 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Dr. {test.doctor.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Ordered:{' '}
                      {new Date(test.orderedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {test.completedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        Result:{' '}
                        {new Date(test.completedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                  )}
                  {test.reviewedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Reviewed by doctor</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
