import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { generateDailyAnalytics } from '@/lib/analytics';
import { authOptions } from '@/lib/auth';
import { startOfDay, subDays } from 'date-fns';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MAIN_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate analytics for the last 30 days
    const promises = [];
    for (let i = 0; i < 30; i++) {
      const date = startOfDay(subDays(new Date(), i));
      promises.push(generateDailyAnalytics(date));
    }

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      message: 'Analytics generated for the last 30 days',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
