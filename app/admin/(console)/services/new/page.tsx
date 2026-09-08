import Link from "next/link";

import { ServiceEditor } from "@/components/admin/ServiceEditor";
import { Button } from "@/components/ui/button";

export const instant = false;

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="rounded-none">
        <Link href="/admin/services">← Back to services</Link>
      </Button>
      <ServiceEditor />
    </div>
  );
}
