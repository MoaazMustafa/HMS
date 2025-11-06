import type { Gender } from '@prisma/client';
// eslint-disable-next-line no-duplicate-imports
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, dateOfBirth, gender } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !phone || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate patient ID
    const patientCount = await prisma.patient.count();
    const patientId = `PAT-${String(patientCount + 1).padStart(3, '0')}`;

    // Create user with patient profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.PATIENT,
        emailVerified: new Date(), // Auto-verify for now
        patient: {
          create: {
            patientId,
            firstName,
            lastName,
            phone,
            dateOfBirth: new Date(dateOfBirth),
            gender: gender as Gender,
          },
        },
      },
      include: {
        patient: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
