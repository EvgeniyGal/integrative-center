import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";

// Admin console needs session + DB on every request.
export const instant = false;

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminShell
      userEmail={session?.user?.email}
      userName={session?.user?.name}
      userRole={session?.user?.role}
    >
      {children}
    </AdminShell>
  );
}
