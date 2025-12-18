import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - HMS',
  description:
    'Sign in to your HMS account to access your healthcare dashboard.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
