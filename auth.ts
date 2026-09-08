import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { verifyPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user?.passwordHash) {
          return null;
        }

        if (user.status !== "active") {
          return null;
        }

        const valid = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          status: user.status,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.status = user.status ?? "active";
        token.role = user.role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.status =
          typeof token.status === "string" ? token.status : "disabled";
        session.user.role =
          typeof token.role === "string" ? token.role : "admin";
        session.user.email =
          typeof token.email === "string" ? token.email : "";
        session.user.name =
          typeof token.name === "string" ? token.name : null;
      }
      return session;
    },
  },
  trustHost: true,
});
