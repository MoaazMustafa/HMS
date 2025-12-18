import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or OTP' },
        { status: 400 },
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 },
      );
    }

    // Find valid OTP token
    const verificationToken = await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        otp,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 },
      );
    }

    // Verify email and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { isUsed: true },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 },
    );
  }
}
