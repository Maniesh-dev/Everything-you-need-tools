import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Sign in or create your Kraaft account.',
};

/**
 * Auth layout — clean, centered card with no header/footer.
 * Used for /login, /register, and /verify pages.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-12">
      {children}
    </div>
  );
}
