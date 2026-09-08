import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";

export const instant = false;

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await db.query.services.findFirst({
    where: eq(services.id, id),
  });
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/services">← Back to services</Link>
      </Button>
      <ServiceEditor service={service} />
    </div>
  );
}
