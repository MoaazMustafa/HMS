import type { NextRequest } from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';

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
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        {
          message:
            'If an account with that email exists, we sent a password reset link',
        },
        { status: 200 },
      );
    }

    // Generate reset token (commented until PasswordResetToken model is added)
    // const resetToken = randomBytes(32).toString('hex');
    // const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store token in database (you'll need to add this to your schema)
    // For now, we'll just return success
    // TODO: Add PasswordResetToken model to schema
    // await prisma.passwordResetToken.create({
    //   data: {
    //     token: resetToken,
    //     userId: user.id,
    //     expiresAt: resetTokenExpiry,
    //   },
    // });

    // TODO: Send email with reset link
    // const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;
    // await sendEmail({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   html: `Click here to reset your password: ${resetLink}`,
    // });

    return NextResponse.json(
      {
        message:
          'If an account with that email exists, we sent a password reset link',
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 },
    );
  }
}
