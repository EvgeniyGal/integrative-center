"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  useEffect,
  useState,
  useTransition,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  AdminTableBody,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import { cn } from "@/lib/utils";

type Identified = { id: string; sortOrder: number };

export function useSortableRows<T extends Identified>(
  items: T[],
  onReorder: (orderedIds: string[]) => Promise<void>,
) {
  const [rows, setRows] = useState(items);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setRows(items);
  }, [items]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((row) => row.id === active.id);
    const newIndex = rows.findIndex((row) => row.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(rows, oldIndex, newIndex).map((row, index) => ({
      ...row,
      sortOrder: index,
    }));
    setRows(next);
    startTransition(() => {
      void onReorder(next.map((row) => row.id));
    });
  }

  return { rows, handleDragEnd };
}

/** Wrap outside `<table>` — DndContext injects accessibility `<div>`s. */
export function SortableTableRoot({
  id,
  ids,
  onDragEnd,
  children,
}: {
  /** Stable id — prevents dnd-kit aria-describedby hydration mismatches. */
  id: string;
  ids: string[];
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function SortableTableBody({ children }: { children: ReactNode }) {
  return <AdminTableBody>{children}</AdminTableBody>;
}

export function SortableAdminTableRow({
  id,
  selected,
  className,
  children,
}: {
  id: string;
  selected?: boolean;
  className?: string;
  children: (drag: {
    attributes: ReturnType<typeof useSortable>["attributes"];
    listeners: ReturnType<typeof useSortable>["listeners"];
  }) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-ivory transition hover:bg-stone/25",
        selected && "bg-brand-light/40 hover:bg-brand-light/50",
        isDragging && "relative z-10 bg-brand-light/60 opacity-95 shadow-md",
        className,
      )}
    >
      {children({ attributes, listeners })}
    </tr>
  );
}

export function OrderDragCell({
  order,
  attributes,
  listeners,
}: {
  order: number;
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
}) {
  return (
    <AdminTableCell>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 text-muted outline-none transition hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/40 cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
        aria-label={`Order ${order}. Drag to reorder`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4 shrink-0" aria-hidden />
        <span className="tabular-nums text-sm text-ink">{order}</span>
      </button>
    </AdminTableCell>
  );
}
