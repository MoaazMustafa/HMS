import { UserRole } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/vital-signs - Get vital signs for a patient
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const limit = searchParams.get('limit');

    // Patients can only view their own vital signs
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

      const vitalSigns = await prisma.vitalSign.findMany({
        where: { patientId: patient.id },
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
        orderBy: { recordedAt: 'desc' },
        take: limit ? parseInt(limit) : undefined,
      });

      return NextResponse.json({
        success: true,
        data: vitalSigns,
      });
    }

    // Doctors and nurses can view any patient's vital signs
    if (
      session.user.role === UserRole.DOCTOR ||
      session.user.role === UserRole.NURSE
    ) {
      if (!patientId) {
        return NextResponse.json(
          { error: 'Patient ID is required' },
          { status: 400 },
        );
      }

      const vitalSigns = await prisma.vitalSign.findMany({
        where: { patientId },
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
        orderBy: { recordedAt: 'desc' },
        take: limit ? parseInt(limit) : undefined,
      });

      return NextResponse.json({
        success: true,
        data: vitalSigns,
      });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST /api/vital-signs - Create new vital sign record
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors and nurses can record vital signs
    if (
      session.user.role !== UserRole.DOCTOR &&
      session.user.role !== UserRole.NURSE
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      patientId,
      systolicBP,
      diastolicBP,
      heartRate,
      temperature,
      weight,
      height,
      oxygenSaturation,
      respiratoryRate,
      notes,
    } = body;

    // Validate required fields
    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
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

    // Calculate BMI if weight and height are provided
    let bmi: number | undefined;
    if (weight && height) {
      // BMI = weight (kg) / (height (m))^2
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    }

    // Determine vital sign status based on normal ranges
    let status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' = 'NORMAL';

    // Check for abnormal/critical values
    if (systolicBP && (systolicBP > 140 || systolicBP < 90)) {
      status = systolicBP > 180 || systolicBP < 80 ? 'CRITICAL' : 'ABNORMAL';
    }
    if (diastolicBP && (diastolicBP > 90 || diastolicBP < 60)) {
      status = diastolicBP > 120 || diastolicBP < 50 ? 'CRITICAL' : 'ABNORMAL';
    }
    if (heartRate && (heartRate > 100 || heartRate < 60)) {
      status = heartRate > 140 || heartRate < 40 ? 'CRITICAL' : 'ABNORMAL';
    }
    if (temperature && (temperature > 38 || temperature < 35)) {
      status = temperature > 39.5 || temperature < 34 ? 'CRITICAL' : 'ABNORMAL';
    }
    if (oxygenSaturation && oxygenSaturation < 95) {
      status = oxygenSaturation < 90 ? 'CRITICAL' : 'ABNORMAL';
    }

    // Create vital sign record
    const vitalSign = await prisma.vitalSign.create({
      data: {
        patientId,
        recordedBy: session.user.id,
        recordedByType: session.user.role,
        systolicBP,
        diastolicBP,
        heartRate,
        temperature,
        weight,
        height,
        oxygenSaturation,
        respiratoryRate,
        bmi,
        status,
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

    // If critical, create notification for doctor (future enhancement)
    if (status === 'CRITICAL') {
      // TODO: Send notification to assigned doctors
      console.log('Critical vital signs detected:', vitalSign.id);
    }

    return NextResponse.json({
      success: true,
      data: vitalSign,
      message: 'Vital signs recorded successfully',
    });
  } catch (error) {
    console.error('Error recording vital signs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
