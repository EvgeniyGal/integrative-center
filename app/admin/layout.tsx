import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Auth pages and console share this root; admin is request-time by nature.
export const instant = false;

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-svh">{children}</div>;
}
