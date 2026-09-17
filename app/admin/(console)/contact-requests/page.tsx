import { ContactSubmissionsTable } from "@/components/admin/ContactSubmissionsTable";
import { getContactSubmissions } from "@/lib/inquiries";

export const instant = false;

export default async function AdminContactRequestsPage() {
  const items = await getContactSubmissions();
  const unread = items.filter((item) => item.status === "new").length;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-muted">
        Contact form submissions are saved here first, then staff are emailed.
        Mark a request as read after you follow up, or open the message to
        review it.
        {unread > 0 ? ` ${unread} new ${unread === 1 ? "request" : "requests"}.` : ""}
      </p>
      <ContactSubmissionsTable items={items} />
    </div>
  );
}
