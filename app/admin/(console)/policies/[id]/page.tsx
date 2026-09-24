import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { PolicyEditor } from "@/components/admin/PolicyEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { policies } from "@/lib/db/schema";

export const instant = false;

export default async function EditPolicyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [policy] = await db
    .select()
    .from(policies)
    .where(eq(policies.id, id))
    .limit(1);
  if (!policy) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/policies">← Back to policies</Link>
      </Button>
      <PolicyEditor policy={policy} />
    </div>
  );
}
