import { UserRole } from '@prisma/client';
import type { NextRequest } from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.PATIENT) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode,
      dateOfBirth,
      gender,
      bloodGroup,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
    } = body;

    // Get patient record
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { patient: true },
    });

    if (!user?.patient) {
      return NextResponse.json({ error: 'Patient record not found' }, { status: 404 });
    }

    // Update user and patient data in a transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Build update data object dynamically
      const patientUpdateData: Record<string, unknown> = {
        profileVersion: { increment: 1 },
      };

      if (firstName) patientUpdateData.firstName = firstName;
      if (lastName) patientUpdateData.lastName = lastName;
      if (phone) patientUpdateData.phone = phone;
      if (address !== undefined) patientUpdateData.address = address;
      if (city !== undefined) patientUpdateData.city = city;
      if (state !== undefined) patientUpdateData.state = state;
      if (zipCode !== undefined) patientUpdateData.zipCode = zipCode;
      if (dateOfBirth) patientUpdateData.dateOfBirth = new Date(dateOfBirth);
      if (gender) patientUpdateData.gender = gender;
      if (bloodGroup !== undefined) patientUpdateData.bloodGroup = bloodGroup;
      if (emergencyContactName !== undefined)
        patientUpdateData.emergencyContactName = emergencyContactName;
      if (emergencyContactPhone !== undefined)
        patientUpdateData.emergencyContactPhone = emergencyContactPhone;
      if (emergencyContactRelation !== undefined)
        patientUpdateData.emergencyContactRelation = emergencyContactRelation;

      // Update patient table
      await tx.patient.update({
        where: { id: user.patient?.id || '' },
        data: patientUpdateData as never,
      });

      // Get updated user
      const updated = await tx.user.findUnique({
        where: { id: session.user.id },
        include: { patient: true },
      });

      return updated;
    });

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
