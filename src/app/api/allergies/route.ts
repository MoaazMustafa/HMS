import { AllergyType, UserRole } from '@prisma/client';
import type { NextRequest} from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/allergies - Get allergies for a patient
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    // Patients can only view their own allergies
    if (session.user.role === UserRole.PATIENT) {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id },
      });

      if (!patient) {
        return NextResponse.json(
          { error: 'Patient record not found' },
          { status: 404 },
        );
      }

      const allergies = await prisma.allergy.findMany({
        where: { patientId: patient.id },
        orderBy: { diagnosedAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: allergies,
      });
    }

    // Doctors can view any patient's allergies
    if (session.user.role === UserRole.DOCTOR) {
      if (!patientId) {
        return NextResponse.json(
          { error: 'Patient ID is required' },
          { status: 400 },
        );
      }

      const allergies = await prisma.allergy.findMany({
        where: { patientId },
        orderBy: { diagnosedAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: allergies,
      });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Error fetching allergies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST /api/allergies - Create new allergy record
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can add allergies
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      patientId,
      allergen,
      type,
      severity,
      reaction,
      diagnosedAt,
      notes,
    } = body;

    // Validate required fields
    if (!patientId || !allergen || !type || !severity) {
      return NextResponse.json(
        { error: 'Patient ID, allergen, type, and severity are required' },
        { status: 400 },
      );
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Validate allergy type
    const validTypes = Object.values(AllergyType);
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid allergy type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Check for duplicate allergy
    const existingAllergy = await prisma.allergy.findFirst({
      where: {
        patientId,
        allergen: {
          equals: allergen,
          mode: 'insensitive',
        },
      },
    });

    if (existingAllergy) {
      return NextResponse.json(
        { error: 'This allergy already exists for the patient' },
        { status: 400 },
      );
    }

    // Create allergy record
    const allergy = await prisma.allergy.create({
      data: {
        patientId,
        allergen,
        type,
        severity,
        reaction,
        diagnosedAt: diagnosedAt ? new Date(diagnosedAt) : new Date(),
        notes,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: allergy,
      message: 'Allergy recorded successfully',
    });
  } catch (error) {
    console.error('Error recording allergy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// DELETE /api/allergies - Delete an allergy record
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can delete allergies
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const allergyId = searchParams.get('id');

    if (!allergyId) {
      return NextResponse.json(
        { error: 'Allergy ID is required' },
        { status: 400 },
      );
    }

    // Verify allergy exists
    const allergy = await prisma.allergy.findUnique({
      where: { id: allergyId },
    });

    if (!allergy) {
      return NextResponse.json({ error: 'Allergy not found' }, { status: 404 });
    }

    // Delete allergy
    await prisma.allergy.delete({
      where: { id: allergyId },
    });

    return NextResponse.json({
      success: true,
      message: 'Allergy deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting allergy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
