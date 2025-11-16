import { ProtectedShell } from '@/features/auth/components/protected-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedShell>{children}</ProtectedShell>;
}

