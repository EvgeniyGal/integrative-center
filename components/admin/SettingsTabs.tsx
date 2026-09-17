import Link from "next/link";

import { cn } from "@/lib/utils";

export const SETTINGS_TABS = [
  { id: "openai", label: "Credentials & models", href: "/admin/settings" },
  {
    id: "knowledge",
    label: "Chat knowledge",
    href: "/admin/settings?tab=knowledge",
  },
  {
    id: "emails",
    label: "Notification emails",
    href: "/admin/settings?tab=emails",
  },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export function parseSettingsTab(value: string | undefined): SettingsTabId {
  if (value === "knowledge" || value === "emails") return value;
  return "openai";
}

export function SettingsTabs({ current }: { current: SettingsTabId }) {
  return (
    <nav
      aria-label="Settings sections"
      className="flex flex-wrap gap-1 border-b border-ink/10"
    >
      {SETTINGS_TABS.map((tab) => {
        const active = tab.id === current;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition",
              active
                ? "border-brand text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
