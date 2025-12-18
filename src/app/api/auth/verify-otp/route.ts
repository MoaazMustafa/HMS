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
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid OTP or email' },
        { status: 400 },
      );
    }

    // Find valid OTP token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        otp,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 },
      );
    }

    // OTP is valid - return success with token ID for password reset
    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        resetTokenId: resetToken.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 },
    );
  }
}
