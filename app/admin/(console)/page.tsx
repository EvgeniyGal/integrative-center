import Link from "next/link";
import {
  FileText,
  HelpCircle,
  Inbox,
  Mail,
  MessageSquareQuote,
  Package,
  Pill,
  Sparkles,
  Store,
  Tags,
  Users,
} from "lucide-react";

import { getDashboardCounts } from "@/lib/content/queries";
import { getInquiryCounts } from "@/lib/inquiries";

export const instant = false;

export default async function AdminDashboardPage() {
  const [counts, inquiries] = await Promise.all([
    getDashboardCounts(),
    getInquiryCounts(),
  ]);

  const cards = [
    {
      href: "/admin/contact-requests",
      label: "Requests",
      value: inquiries.unreadContactRequests,
      hint:
        inquiries.contactRequests === 0
          ? "Contact form submissions"
          : `${inquiries.contactRequests} total · unread shown`,
      icon: Inbox,
    },
    {
      href: "/admin/subscribers",
      label: "Subscribers",
      value: inquiries.subscribers,
      hint: "Active newsletter signups",
      icon: Mail,
    },
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
    {
      href: "/admin/supplement-brands",
      label: "Brands",
      value: counts.supplementBrands,
      hint: "HBIC supplement brands",
      icon: Pill,
    },
    {
      href: "/admin/product-categories",
      label: "Categories",
      value: counts.productCategories,
      hint: "Product filter categories",
      icon: Tags,
    },
    {
      href: "/admin/store-brands",
      label: "Store buttons",
      value: counts.storeBrands,
      hint: "Shared product CTA logos",
      icon: Store,
    },
    {
      href: "/admin/recommended-products",
      label: "Products",
      value: counts.recommendedProducts,
      hint: "Store recommendations",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-muted">
          Review contact requests and newsletter signups, then manage
          homepage questions, services, patient quotes, news, and supplement
          recommendations. Changes go live after you save.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
            <li>
              Use AI draft assist on services, articles, and products, then
              review before publishing. Configure models and the chat widget
              under Settings.
            </li>
            <li>Only published / visible items appear on the public site.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
