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
} from 'lucide-react';
import { useState } from 'react';

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
        return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/20';
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

  const completedTests = labTests.filter((t) => t.status === 'COMPLETED').length;
  const pendingTests = labTests.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS')
    .length;
  const criticalResults = labTests.filter((t) => t.isCritical).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Lab Results</h1>
          <p className="text-zinc-400">View your laboratory test results and trends</p>
        </div>
      </div>

      {/* Critical Alert */}
      {criticalResults > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400 mb-1">
              {criticalResults} Critical Result{criticalResults > 1 ? 's' : ''} Detected
            </p>
            <p className="text-xs text-red-400/80">
              Please contact your healthcare provider immediately to discuss these results.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-zinc-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as 'all' | 'completed' | 'pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-primary text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by test name, type, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      {/* Lab Tests List */}
      <div className="space-y-4">
        {filteredTests.length === 0 ? (
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-lg p-12 text-center">
            <FlaskConical className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No lab results found</h3>
            <p className="text-zinc-400">
              {searchQuery ? 'Try adjusting your search criteria' : 'No lab tests available'}
            </p>
          </div>
        ) : (
          filteredTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-zinc-900/50 backdrop-blur-xl border rounded-lg p-6 transition-all ${
                test.isCritical
                  ? 'border-red-500/50 hover:border-red-500'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FlaskConical className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{test.testName}</h3>
                        {test.isCritical && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-500 border border-red-500/20 rounded text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mb-1">{test.testType}</p>
                      <p className="text-xs text-zinc-500 font-mono">Test ID: {test.testId}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                      test.status
                    )}`}
                  >
                    {test.status}
                  </span>
                </div>

                {/* Result Display */}
                {test.results && test.status === 'COMPLETED' && (
                  <div className="p-4 bg-zinc-800/50 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Result</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-white">
                            {test.results}
                            {test.unit && <span className="text-sm text-zinc-400 ml-1">{test.unit}</span>}
                          </p>
                          {test.referenceRange && isResultAbnormal(test.results, test.referenceRange) && (
                            <>
                              {parseFloat(test.results) >
                              parseFloat(test.referenceRange.split('-')[1]) ? (
                                <TrendingUp className="w-5 h-5 text-red-500" />
                              ) : (
                                <TrendingDown className="w-5 h-5 text-red-500" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      {test.referenceRange && (
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Reference Range</p>
                          <p className="text-white font-medium">
                            {test.referenceRange}
                            {test.unit && <span className="text-sm text-zinc-400 ml-1">{test.unit}</span>}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Status</p>
                        <p className="text-white font-medium">
                          {isResultAbnormal(test.results, test.referenceRange || '')
                            ? 'Abnormal'
                            : 'Normal'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {test.notes && (
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-400">{test.notes}</p>
                  </div>
                )}

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Dr. {test.doctor.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
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
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Result:{' '}
                        {new Date(test.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {test.reviewedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
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
