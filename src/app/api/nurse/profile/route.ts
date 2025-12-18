import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/nurse/profile - Get nurse profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.NURSE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const nurse = await prisma.nurse.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!nurse) {
      return NextResponse.json({ error: 'Nurse not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: nurse,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching nurse profile:', error.message);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PUT /api/nurse/profile - Update nurse profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.NURSE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, email, phoneNumber } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 },
        );
      }
    }

    // Update nurse profile in a transaction
    const updatedNurse = await prisma.$transaction(async (tx) => {
      // Update user data
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          name: `${firstName} ${lastName}`,
          email: email || session.user.email,
          phoneNumber: phoneNumber || phone,
        },
      });

      // Update nurse data
      const nurse = await tx.nurse.update({
        where: { userId: session.user.id },
        data: {
          firstName,
          lastName,
          phone,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });

      return nurse;
    });

    return NextResponse.json({
      success: true,
      data: updatedNurse,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating nurse profile:', error.message);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
