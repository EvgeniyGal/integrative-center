import { NewsletterSubscribersTable } from "@/components/admin/NewsletterSubscribersTable";
import { getNewsletterSubscribers } from "@/lib/inquiries";

export const instant = false;

export default async function AdminSubscribersPage() {
  const items = await getNewsletterSubscribers();
  const active = items.filter((item) => item.status === "active").length;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-muted">
        Newsletter signups are stored by email. Resubscribing updates the same
        record. Mark someone as unsubscribed to keep the history without
        counting them as active.
        {items.length > 0
          ? ` ${active} active of ${items.length}.`
          : ""}
      </p>
      <NewsletterSubscribersTable items={items} />
    </div>
  );
}
