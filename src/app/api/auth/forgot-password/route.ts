import { type NextRequest, NextResponse } from 'next/server';

import { generateOTP, getPasswordResetEmailTemplate, sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            'If an account with that email exists, we sent a password reset code',
        },
        { status: 200 },
      );
    }

    // Delete any existing unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        isUsed: false,
      },
    });

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        otp,
        expiresAt,
      },
    });

    // Send email with OTP
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Password Reset - HMS Healthcare',
      html: getPasswordResetEmailTemplate(user.name || 'User', otp),
      text: `Your password reset OTP is: ${otp}. This code expires in 10 minutes.`,
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      // Don't expose email sending failure to prevent information disclosure
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'If an account with that email exists, we sent a password reset code',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 },
    );
  }
}
