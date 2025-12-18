import { UserRole } from '@prisma/client';
import type { NextRequest} from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

// GET /api/admin/audit-logs - Get system audit logs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      (session.user.role !== UserRole.ADMIN &&
        session.user.role !== UserRole.MAIN_ADMIN)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock audit logs - in production, you'd have a proper audit log table
    const mockLogs = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        userId: session.user.id,
        userName: session.user.name,
        action: 'LOGIN',
        resource: 'AUTH',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.1',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: '123',
        userName: 'Dr. John Smith',
        action: 'CREATE',
        resource: 'PRESCRIPTION',
        details: 'Created prescription for patient P001',
        ipAddress: '192.168.1.5',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        userId: '456',
        userName: 'Nurse Jane Doe',
        action: 'UPDATE',
        resource: 'VITAL_SIGNS',
        details: 'Updated vital signs for patient P002',
        ipAddress: '192.168.1.10',
      },
    ];

    return NextResponse.json({
      logs: mockLogs,
      pagination: {
        total: mockLogs.length,
        page,
        limit,
        pages: 1,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 },
    );
  }
}
