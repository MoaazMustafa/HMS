import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - HMS',
  description: 'Create a new patient account to access HMS healthcare services.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
