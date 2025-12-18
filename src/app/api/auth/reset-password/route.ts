import bcrypt from 'bcryptjs';
import { type NextRequest, NextResponse } from 'next/server';

import { getPasswordResetSuccessEmailTemplate, sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 },
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid request' },
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

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { isUsed: true },
      }),
    ]);

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: 'Password Changed Successfully - HMS Healthcare',
      html: getPasswordResetSuccessEmailTemplate(user.name || 'User'),
      text: 'Your password has been successfully changed. If you did not make this change, please contact support immediately.',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 },
    );
  }
}
