import type { Gender } from '@prisma/client';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import { generateOTP, getEmailVerificationTemplate, sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, dateOfBirth, gender } =
      body;

    // Validation
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !dateOfBirth
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate patient ID
    const patientCount = await prisma.patient.count();
    const patientId = `PAT-${String(patientCount + 1).padStart(3, '0')}`;

    // Create user with patient profile (email NOT verified yet)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.PATIENT,
        emailVerified: null, // Not verified until OTP confirmed
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

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP in database
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    // Send verification email
    const emailResult = await sendEmail({
      to: email,
      subject: 'Verify Your Email - HMS Healthcare',
      html: getEmailVerificationTemplate(`${firstName} ${lastName}`, otp),
      text: `Welcome to HMS Healthcare! Your email verification code is: ${otp}. This code expires in 15 minutes.`,
    });

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail registration if email fails - user can request new OTP
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please check your email for verification code.',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 },
    );
  }
}
