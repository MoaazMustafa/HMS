import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Mock drug interaction database (in production, use external API or database)
const DRUG_INTERACTIONS: Record<string, Array<{ drug: string; severity: string; description: string }>> = {
  warfarin: [
    { drug: 'aspirin', severity: 'SEVERE', description: 'Increased risk of bleeding' },
    { drug: 'ibuprofen', severity: 'MODERATE', description: 'May increase bleeding risk' },
  ],
  aspirin: [
    { drug: 'warfarin', severity: 'SEVERE', description: 'Increased risk of bleeding' },
    { drug: 'ibuprofen', severity: 'MODERATE', description: 'Increased GI bleeding risk' },
  ],
  // Add more interactions as needed
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can create prescriptions
    if (session.user.role !== UserRole.DOCTOR) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ success: false, error: 'Doctor profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { patientId, medicationName, dosage, frequency, duration, instructions, refillsRemaining } = body;

    // Validation
    if (!patientId || !medicationName || !dosage || !frequency || !duration) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Verify patient is assigned to doctor
    const assignment = await prisma.patientDoctorAssignment.findFirst({
      where: {
        patientId,
        doctorId: doctor.id,
        status: 'ACTIVE',
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: 'Patient is not assigned to you' },
        { status: 403 }
      );
    }

    // Get patient info including allergies
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        allergies: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    // Generate unique prescription ID
    const year = new Date().getFullYear();
    const lastPrescription = await prisma.prescription.findFirst({
      where: {
        prescriptionId: {
          startsWith: `RX-${year}-`,
        },
      },
      orderBy: {
        prescriptionId: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastPrescription) {
      const lastNumber = parseInt(lastPrescription.prescriptionId.split('-')[2], 10);
      nextNumber = lastNumber + 1;
    }

    const prescriptionId = `RX-${year}-${String(nextNumber).padStart(5, '0')}`;

    // Calculate expiration date (default 90 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    // Check for drug interactions
    const interactions: Array<{ interactsWith: string; severity: string; description: string }> = [];

    // Check against patient allergies
    const medicationLower = medicationName.toLowerCase();
    patient.allergies.forEach((allergy) => {
      if (medicationLower.includes(allergy.allergen.toLowerCase()) || allergy.allergen.toLowerCase().includes(medicationLower)) {
        interactions.push({
          interactsWith: allergy.allergen,
          severity: allergy.severity || 'SEVERE',
          description: `Patient is allergic to ${allergy.allergen}`,
        });
      }
    });

    // Check against known drug interactions
    const knownInteractions = DRUG_INTERACTIONS[medicationLower] || [];
    for (const interaction of knownInteractions) {
      // Check if patient is on this interacting drug
      const existingPrescription = await prisma.prescription.findFirst({
        where: {
          patientId,
          status: 'ACTIVE',
          medicationName: {
            contains: interaction.drug,
            mode: 'insensitive',
          },
        },
      });

      if (existingPrescription) {
        interactions.push({
          interactsWith: interaction.drug,
          severity: interaction.severity,
          description: interaction.description,
        });
      }
    }

    // Create prescription with interactions
    const prescription = await prisma.prescription.create({
      data: {
        prescriptionId,
        patientId,
        doctorId: doctor.id,
        medicationName,
        dosage,
        frequency,
        duration,
        instructions,
        refillsRemaining: refillsRemaining || 0,
        status: 'ACTIVE',
        issuedAt: new Date(),
        expiresAt,
        interactions: {
          create: interactions.map((interaction) => ({
            interactsWith: interaction.interactsWith,
            severity: interaction.severity,
            description: interaction.description,
          })),
        },
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
        interactions: true,
      },
    });

    return NextResponse.json({ success: true, data: prescription, interactions });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
}
