import { UserRole } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/immunizations - Get immunizations for a patient
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    // Patients can only view their own immunizations
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

      const immunizations = await prisma.immunization.findMany({
        where: { patientId: patient.id },
        orderBy: { dateAdministered: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: immunizations,
      });
    }

    // Doctors can view any patient's immunizations
    if (session.user.role === UserRole.DOCTOR) {
      if (!patientId) {
        return NextResponse.json(
          { error: 'Patient ID is required' },
          { status: 400 },
        );
      }

      const immunizations = await prisma.immunization.findMany({
        where: { patientId },
        orderBy: { dateAdministered: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: immunizations,
      });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error) {
    console.error('Error fetching immunizations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST /api/immunizations - Create new immunization record
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can add immunizations
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      patientId,
      vaccineName,
      dateAdministered,
      doseNumber,
      manufacturer,
      lotNumber,
      expirationDate,
      site,
      administeredBy,
      nextDueDate,
      notes,
    } = body;

    // Validate required fields
    if (!patientId || !vaccineName || !dateAdministered) {
      return NextResponse.json(
        {
          error:
            'Patient ID, vaccine name, and administration date are required',
        },
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

    // Create immunization record
    const immunization = await prisma.immunization.create({
      data: {
        patientId,
        vaccineName,
        dateAdministered: new Date(dateAdministered),
        doseNumber,
        manufacturer,
        lotNumber,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        site,
        administeredBy: administeredBy || session.user.name || 'Unknown',
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
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
      data: immunization,
      message: 'Immunization recorded successfully',
    });
  } catch (error) {
    console.error('Error recording immunization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PUT /api/immunizations - Update an immunization record
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can update immunizations
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Immunization ID is required' },
        { status: 400 },
      );
    }

    // Verify immunization exists
    const existingImmunization = await prisma.immunization.findUnique({
      where: { id },
    });

    if (!existingImmunization) {
      return NextResponse.json(
        { error: 'Immunization not found' },
        { status: 404 },
      );
    }

    // Update immunization
    const immunization = await prisma.immunization.update({
      where: { id },
      data: {
        ...updateData,
        dateAdministered: updateData.dateAdministered
          ? new Date(updateData.dateAdministered)
          : undefined,
        expirationDate: updateData.expirationDate
          ? new Date(updateData.expirationDate)
          : undefined,
        nextDueDate: updateData.nextDueDate
          ? new Date(updateData.nextDueDate)
          : undefined,
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
      data: immunization,
      message: 'Immunization updated successfully',
    });
  } catch (error) {
    console.error('Error updating immunization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// DELETE /api/immunizations - Delete an immunization record
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can delete immunizations
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const immunizationId = searchParams.get('id');

    if (!immunizationId) {
      return NextResponse.json(
        { error: 'Immunization ID is required' },
        { status: 400 },
      );
    }

    // Verify immunization exists
    const immunization = await prisma.immunization.findUnique({
      where: { id: immunizationId },
    });

    if (!immunization) {
      return NextResponse.json(
        { error: 'Immunization not found' },
        { status: 404 },
      );
    }

    // Delete immunization
    await prisma.immunization.delete({
      where: { id: immunizationId },
    });

    return NextResponse.json({
      success: true,
      message: 'Immunization deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting immunization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
