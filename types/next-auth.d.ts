import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    status?: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      status: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    status?: string;
    role?: string;
  }
}
