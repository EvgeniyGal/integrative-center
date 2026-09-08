import { auth } from "@/auth";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const STAFF_ROLES = ["admin", "editor"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

function isStaffRole(role: string): role is StaffRole {
  return STAFF_ROLES.includes(role as StaffRole);
}

async function requireActiveUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user || user.status !== "active" || !isStaffRole(user.role)) {
    throw new Error("Unauthorized");
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      role: user.role,
    },
  };
}

/** Any active staff member (admin or editor) can manage content. */
export async function requireAdmin() {
  return requireActiveUser();
}

/** Only full admins can manage users / invites. */
export async function requireUserManager() {
  const session = await requireActiveUser();
  if (session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}
