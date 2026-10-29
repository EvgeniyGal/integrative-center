import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { PatientFormEditor } from "@/components/admin/PatientFormEditor";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { patientForms } from "@/lib/db/schema";

export const instant = false;

export default async function EditPatientFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(patientForms)
    .where(eq(patientForms.id, id))
    .limit(1);
  const form = rows[0];
  if (!form) notFound();

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/patient-forms">← Back to patient forms</Link>
      </Button>
      <PatientFormEditor form={form} />
    </div>
  );
}
