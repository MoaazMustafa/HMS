import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            patient: true,
            doctor: true,
            nurse: true,
            receptionist: true,
            admin: true,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // Check if account is active
        if (user.accountStatus !== 'ACTIVE') {
          throw new Error(
            'Your account is not active. Please contact support.',
          );
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // Get role-specific name
        let name = user.email;
        switch (user.role) {
          case UserRole.PATIENT:
            name = user.patient
              ? `${user.patient.firstName} ${user.patient.lastName}`
              : user.email;
            break;
          case UserRole.DOCTOR:
            name = user.doctor
              ? `Dr. ${user.doctor.firstName} ${user.doctor.lastName}`
              : user.email;
            break;
          case UserRole.NURSE:
            name = user.nurse
              ? `${user.nurse.firstName} ${user.nurse.lastName}`
              : user.email;
            break;
          case UserRole.RECEPTIONIST:
            name = user.receptionist
              ? `${user.receptionist.firstName} ${user.receptionist.lastName}`
              : user.email;
            break;
          case UserRole.ADMIN:
          case UserRole.MAIN_ADMIN:
            name = user.admin
              ? `${user.admin.firstName} ${user.admin.lastName}`
              : user.email;
            break;
        }

        return {
          id: user.id,
          email: user.email,
          name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
