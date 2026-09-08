import Link from "next/link";
import {
  FileText,
  HelpCircle,
  MessageSquareQuote,
  Sparkles,
  Users,
} from "lucide-react";

import { getDashboardCounts } from "@/lib/content/queries";

export const instant = false;

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  const cards = [
    {
      href: "/admin/questions",
      label: "Questions",
      value: counts.questions,
      hint: "Homepage FAQ cards",
      icon: HelpCircle,
    },
    {
      href: "/admin/services",
      label: "Services",
      value: counts.services,
      hint: "Care offerings",
      icon: Sparkles,
    },
    {
      href: "/admin/testimonials",
      label: "Testimonials",
      value: counts.testimonials,
      hint: "Patient quotes",
      icon: MessageSquareQuote,
    },
    {
      href: "/admin/news",
      label: "Articles",
      value: counts.articles,
      hint: "News & insights",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-muted">
          Manage homepage questions, services, patient quotes, and news. Changes
          go live after you save.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group border border-ink/10 bg-ivory p-5 transition hover:border-brand"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
                  {card.label}
                </p>
                <Icon className="size-4 text-brand opacity-80 transition group-hover:opacity-100" />
              </div>
              <p className="mt-4 font-display text-4xl text-ink">{card.value}</p>
              <p className="mt-2 text-sm text-muted">{card.hint}</p>
            </Link>
          );
        })}
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border border-ink/10 bg-ivory p-6">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-brand" />
            <h2 className="font-display text-2xl">Admin users</h2>
          </div>
          <p className="mt-2 text-sm text-muted">
            Invite colleagues by email. They set their own password from the
            invite link — there is no public registration.
          </p>
          <Link
            href="/admin/users"
            className="mt-5 inline-flex text-sm text-brand hover:underline"
          >
            Manage admins →
          </Link>
        </div>
        <div className="border border-ink/10 bg-ivory p-6">
          <h2 className="font-display text-2xl">Quick tips</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Hide services without deleting them using the Visible toggle.</li>
            <li>Use AI draft assist on services and articles, then review before publishing.</li>
            <li>Only published / visible items appear on the public site.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
