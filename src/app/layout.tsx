import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import { ThemeProvider } from '@/components';
import { AuthProvider } from '@/components/auth-provider';
import { AOSInit } from '@/components/ui/aos-init';
import { defaultMetadata } from '@/lib/metadata';

import '@/styles/globals.css';
import 'aos/dist/aos.css';
import ClickSpark from '../components/ui/Spark';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/favicon-apple.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#acec00"
          shadow="0 0 10px #acec00, 0 0 5px #acec00"
          height={4}
          showSpinner={true}
        />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AOSInit />
            <ClickSpark
              sparkColor="#ACEC00"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              {children}
            </ClickSpark>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
