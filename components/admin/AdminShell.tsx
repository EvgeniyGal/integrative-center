"use client";

import {
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Pill,
  Sparkles,
  Store,
  Tags,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logoutAction } from "@/app/admin/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const contentLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/questions", label: "Questions", icon: HelpCircle },
  { href: "/admin/services", label: "Services", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/news", label: "News", icon: FileText },
  { href: "/admin/supplement-brands", label: "Brands", icon: Pill },
  { href: "/admin/product-categories", label: "Categories", icon: Tags },
  { href: "/admin/store-brands", label: "Store buttons", icon: Store },
  { href: "/admin/recommended-products", label: "Products", icon: Package },
];

const systemLinks = [
  { href: "/admin/users", label: "Admins", icon: Users },
];

function NavLinks({
  pathname,
  onNavigate,
  showUserManagement,
}: {
  pathname: string;
  onNavigate?: () => void;
  showUserManagement: boolean;
}) {
  return (
    <>
      <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/40">
        Content
      </p>
      <ul className="space-y-1">
        {contentLinks.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-brand text-white"
                    : "text-ivory/75 hover:bg-white/8 hover:text-ivory",
                )}
              >
                <Icon className="size-4 shrink-0 opacity-90" />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {showUserManagement ? (
        <>
          <p className="mb-2 mt-8 px-3 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory/40">
            System
          </p>
          <ul className="space-y-1">
            {systemLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                      active
                        ? "bg-brand text-white"
                        : "text-ivory/75 hover:bg-white/8 hover:text-ivory",
                    )}
                  >
                    <Icon className="size-4 shrink-0 opacity-90" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </>
  );
}

function pageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/questions/new") return "New question";
  if (pathname.startsWith("/admin/questions/") && pathname !== "/admin/questions") {
    return "Edit question";
  }
  if (pathname.startsWith("/admin/questions")) return "Questions";
  if (pathname === "/admin/services/new") return "New service";
  if (pathname.startsWith("/admin/services/") && pathname !== "/admin/services") {
    return "Edit service";
  }
  if (pathname.startsWith("/admin/services")) return "Services";
  if (pathname === "/admin/testimonials/new") return "New testimonial";
  if (
    pathname.startsWith("/admin/testimonials/") &&
    pathname !== "/admin/testimonials"
  ) {
    return "Edit testimonial";
  }
  if (pathname.startsWith("/admin/testimonials")) return "Testimonials";
  if (pathname === "/admin/news/new") return "New article";
  if (pathname.startsWith("/admin/news/") && pathname !== "/admin/news") {
    return "Edit article";
  }
  if (pathname.startsWith("/admin/news")) return "News";
  if (pathname === "/admin/supplement-brands/new") return "New brand";
  if (
    pathname.startsWith("/admin/supplement-brands/") &&
    pathname !== "/admin/supplement-brands"
  ) {
    return "Edit brand";
  }
  if (pathname.startsWith("/admin/supplement-brands")) return "Brands";
  if (pathname === "/admin/product-categories/new") return "New category";
  if (
    pathname.startsWith("/admin/product-categories/") &&
    pathname !== "/admin/product-categories"
  ) {
    return "Edit category";
  }
  if (pathname.startsWith("/admin/product-categories")) return "Categories";
  if (pathname === "/admin/store-brands/new") return "New store button";
  if (
    pathname.startsWith("/admin/store-brands/") &&
    pathname !== "/admin/store-brands"
  ) {
    return "Edit store button";
  }
  if (pathname.startsWith("/admin/store-brands")) return "Store buttons";
  if (pathname === "/admin/recommended-products/new") return "New product";
  if (
    pathname.startsWith("/admin/recommended-products/") &&
    pathname !== "/admin/recommended-products"
  ) {
    return "Edit product";
  }
  if (pathname.startsWith("/admin/recommended-products")) return "Products";
  if (pathname.startsWith("/admin/users/") && pathname !== "/admin/users") {
    return "Edit admin";
  }
  if (pathname.startsWith("/admin/users")) return "Admins";
  return "Admin";
}

export function AdminShell({
  userEmail,
  userName,
  userRole = "admin",
  children,
}: {
  userEmail?: string | null;
  userName?: string | null;
  userRole?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const title = pageTitle(pathname);
  const showUserManagement = userRole === "admin";

  return (
    <div className="flex min-h-svh bg-stone/30">
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-svh w-64 shrink-0 flex-col bg-ink text-ivory transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-brand-light">
              HBI Admin
            </p>
            <p className="mt-1 font-display text-xl leading-none">
              Content console
            </p>
          </div>
          <button
            type="button"
            className="rounded-md p-1.5 text-ivory/70 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <NavLinks
            pathname={pathname}
            onNavigate={() => setOpen(false)}
            showUserManagement={showUserManagement}
          />
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 truncate px-1">
            <p className="truncate text-sm text-ivory">
              {userName || "Admin"}
            </p>
            {userEmail ? (
              <p className="truncate text-xs text-ivory/50">{userEmail}</p>
            ) : null}
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 rounded-md border border-white/15 text-ivory/85 hover:bg-white/10"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
          <Link
            href="/"
            className="mt-3 block px-1 text-xs text-ivory/45 transition hover:text-brand-light"
          >
            View public site →
          </Link>
        </div>
      </aside>

      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink/10 bg-ivory/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-ink/10 text-ink lg:hidden"
            aria-label="Open sidebar"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
              Admin
            </p>
            <h1 className="truncate font-display text-2xl text-ink sm:text-3xl">
              {title}
            </h1>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
