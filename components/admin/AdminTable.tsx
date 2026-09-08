import { cn } from "@/lib/utils";

export function AdminTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-ink/10 bg-ivory shadow-[0_1px_0_rgba(28,27,25,0.04)]",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTableElement({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <table className={cn("min-w-full border-collapse text-left text-sm", className)}>
      {children}
    </table>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-ink text-[11px] uppercase tracking-[0.16em] text-ivory">
      {children}
    </thead>
  );
}

export function AdminTableHeaderCell({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap px-4 py-3.5 font-medium first:pl-5 last:pr-5",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-ink/8">{children}</tbody>;
}

export function AdminTableRow({
  children,
  className,
  selected,
}: {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
}) {
  return (
    <tr
      className={cn(
        "bg-ivory transition hover:bg-stone/25",
        selected && "bg-brand-light/40 hover:bg-brand-light/50",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn("px-4 py-4 align-middle first:pl-5 last:pr-5", className)}
    >
      {children}
    </td>
  );
}

const statusToneClass = {
  success: "bg-brand/15 text-brand-dark",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-800",
  info: "bg-sky-100 text-sky-900",
  neutral: "bg-ink/8 text-muted",
} as const;

export type StatusTone = keyof typeof statusToneClass;

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]",
        statusToneClass[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatusToggle({
  action,
  id,
  field,
  value,
  onLabel,
  offLabel,
  onTone = "success",
  offTone = "neutral",
}: {
  action: (formData: FormData) => Promise<void> | void;
  id: string;
  field: string;
  value: boolean;
  onLabel: string;
  offLabel: string;
  onTone?: StatusTone;
  offTone?: StatusTone;
}) {
  const next = !value;
  const label = value ? onLabel : offLabel;
  const tone = value ? onTone : offTone;

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(next)} />
      <button
        type="submit"
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] transition hover:ring-2 hover:ring-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
          statusToneClass[tone],
        )}
        title={`Switch to ${next ? onLabel : offLabel}`}
        aria-label={`${field}: ${label}. Click to set ${next ? onLabel : offLabel}`}
        aria-pressed={value}
      >
        {label}
      </button>
    </form>
  );
}

export function PreviewFrame({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden border border-ink/10 bg-stone/20", className)}>
      <div className="flex items-center justify-between border-b border-ink/10 bg-ink px-4 py-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/80">
          Preview · {label}
        </p>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
