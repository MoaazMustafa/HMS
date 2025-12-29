import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  getTimeRangeFromString,
  getDailyAnalytics,
  getDepartmentAnalytics,
  getTopMedications,
  getTopDiagnoses,
  getQuickStats,
} from '@/lib/analytics';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MAIN_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '7days';

    const { startDate, endDate } = getTimeRangeFromString(timeRange);

    // Fetch all analytics data
    const [
      dailyAnalytics,
      departmentAnalytics,
      topMedications,
      topDiagnoses,
      quickStats,
    ] = await Promise.all([
      getDailyAnalytics({ startDate, endDate }),
      getDepartmentAnalytics({ startDate, endDate }),
      getTopMedications({ startDate, endDate }, 5),
      getTopDiagnoses({ startDate, endDate }, 5),
      getQuickStats({ startDate, endDate }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        quickStats,
        dailyAnalytics,
        departmentAnalytics,
        topMedications,
        topDiagnoses,
        timeRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
    });
  } catch {
    // Log error silently
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
