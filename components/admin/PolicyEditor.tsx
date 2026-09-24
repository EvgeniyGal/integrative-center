"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { generatePolicyDraftAction } from "@/app/admin/actions/ai";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  createPolicyAction,
  updatePolicyAction,
  type PolicyActionState,
} from "@/app/admin/actions/policies";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { ArticleBlocks } from "@/components/content/ArticleBlocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleBlock } from "@/lib/content/blocks";
import { safeParseMarkdown } from "@/lib/content/markdown";
import { policyBodyToMarkdown } from "@/lib/content/policy-body";
import type { Policy } from "@/lib/db/schema";

function insertAtCursor(
  value: string,
  start: number,
  end: number,
  insertion: string,
) {
  return {
    next: `${value.slice(0, start)}${insertion}${value.slice(end)}`,
    caret: start + insertion.length,
  };
}

function InsertDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmLabel,
  confirmDisabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDisabled?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 border border-ink/10 bg-ivory p-6 shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="font-display text-2xl text-ink">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1 text-muted transition hover:bg-ink/5 hover:text-ink"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-5 space-y-4">{children}</div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={confirmDisabled}
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function PolicyEditor({ policy }: { policy?: Policy }) {
  const router = useRouter();
  const id = policy?.id ?? "new";
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(policy?.title ?? "");
  const [slug, setSlug] = useState(policy?.slug ?? "");
  const [sortOrder, setSortOrder] = useState(policy?.sortOrder ?? 0);
  const [bodyMarkdown, setBodyMarkdown] = useState(() =>
    policyBodyToMarkdown(policy?.body),
  );
  const [notes, setNotes] = useState("");
  const [lastGoodBlocks, setLastGoodBlocks] = useState<ArticleBlock[]>(
    () => (Array.isArray(policy?.body) ? policy.body : []),
  );
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkLabel, setLinkLabel] = useState("Read more");
  const [linkHref, setLinkHref] = useState("https://");

  const action = policy ? updatePolicyAction : createPolicyAction;
  const [state, formAction, pending] = useActionState(
    action,
    {} as PolicyActionState,
  );
  const [aiState, aiAction, aiPending] = useActionState(
    generatePolicyDraftAction,
    {} as ActionState & {
      draft?: { title: string; slug: string; bodyMarkdown: string };
    },
  );

  const parseResult = useMemo(
    () => safeParseMarkdown(bodyMarkdown),
    [bodyMarkdown],
  );

  useEffect(() => {
    if (parseResult.ok) {
      setLastGoodBlocks(parseResult.blocks);
    }
  }, [parseResult]);

  useEffect(() => {
    if (state.success && !policy) {
      router.push("/admin/policies");
      router.refresh();
    }
  }, [state.success, policy, router]);

  useEffect(() => {
    if (!aiState.draft) return;
    setTitle(aiState.draft.title);
    setSlug(aiState.draft.slug);
    setBodyMarkdown(aiState.draft.bodyMarkdown);
  }, [aiState.draft]);

  function applyInsertion(insertion: string) {
    const el = markdownRef.current;
    const start = el?.selectionStart ?? bodyMarkdown.length;
    const end = el?.selectionEnd ?? bodyMarkdown.length;
    const { next, caret } = insertAtCursor(bodyMarkdown, start, end, insertion);
    setBodyMarkdown(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  }

  function openLinkModal() {
    const el = markdownRef.current;
    const selected = el
      ? bodyMarkdown.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0)
      : "";
    setLinkLabel(selected.trim() || "Read more");
    setLinkHref("https://");
    setLinkOpen(true);
  }

  function confirmLink() {
    const label = linkLabel.trim() || "Read more";
    const href = linkHref.trim();
    if (!href) return;
    applyInsertion(`[${label}](${href})`);
  }

  const canSave = parseResult.ok;
  const blocksForSave = parseResult.ok
    ? JSON.stringify(parseResult.blocks)
    : JSON.stringify(lastGoodBlocks);
  const previewBlocks = parseResult.ok ? parseResult.blocks : lastGoodBlocks;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
      <div className="space-y-5">
        <form
          action={aiAction}
          className="space-y-4 border border-dashed border-brand/35 bg-brand-light/25 p-5"
        >
          <div className="space-y-1">
            <h3 className="font-display text-xl text-ink">AI draft assist</h3>
            <p className="text-sm text-muted">
              Paste your notes. AI formats them as Markdown (headings, lists,
              quotes, links) without rewriting your wording — review before
              saving.
            </p>
          </div>
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="fallbackBody" value={bodyMarkdown} />
          <AdminField label="Notes" htmlFor={`notes-${id}`}>
            <Textarea
              id={`notes-${id}`}
              name="notes"
              variant="box"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Paste the policy copy to format. Leave blank to format the Markdown body below."
            />
          </AdminField>
          {aiState.error ? (
            <p className="text-sm text-red-700">{aiState.error}</p>
          ) : null}
          {aiState.success ? (
            <p className="text-sm text-brand-dark">{aiState.success}</p>
          ) : null}
          <Button type="submit" variant="outline" size="sm" disabled={aiPending}>
            {aiPending ? "Generating…" : "Generate draft"}
          </Button>
        </form>

        <form action={formAction} className="space-y-5">
          {policy ? <input type="hidden" name="id" value={policy.id} /> : null}
          <input type="hidden" name="bodyMarkdown" value={bodyMarkdown} />
          <input type="hidden" name="blocks" value={blocksForSave} />

          <AdminSection
            title="Basics"
            description="Title and URL slug used on the office policies page."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Title" htmlFor={`title-${id}`}>
                <Input
                  id={`title-${id}`}
                  name="title"
                  variant="box"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </AdminField>
              <AdminField
                label="Slug"
                htmlFor={`slug-${id}`}
                hint="Leave blank to auto-generate"
              >
                <Input
                  id={`slug-${id}`}
                  name="slug"
                  variant="box"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="appointments-cancellations"
                />
              </AdminField>
            </div>
            <AdminField label="Sort order" htmlFor={`sort-${id}`}>
              <Input
                id={`sort-${id}`}
                name="sortOrder"
                type="number"
                variant="box"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </AdminField>
          </AdminSection>

          <AdminSection
            title="Content"
            description="Body is Markdown with links — no images or video."
          >
            <div className="flex flex-wrap gap-2 rounded-sm border border-brand/25 bg-brand-light/30 p-2">
              <Button type="button" size="sm" onClick={openLinkModal}>
                <Link2 className="size-3.5" />
                Link
              </Button>
            </div>

            <InsertDialog
              open={linkOpen}
              onOpenChange={setLinkOpen}
              title="Insert link"
              description="Add a label and destination URL."
              onConfirm={confirmLink}
              confirmLabel="Insert link"
              confirmDisabled={!linkLabel.trim() || !linkHref.trim()}
            >
              <AdminField label="Label" htmlFor={`link-label-${id}`}>
                <Input
                  id={`link-label-${id}`}
                  variant="box"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  placeholder="Learn more"
                  autoFocus
                />
              </AdminField>
              <AdminField label="URL" htmlFor={`link-href-${id}`}>
                <Input
                  id={`link-href-${id}`}
                  variant="box"
                  value={linkHref}
                  onChange={(e) => setLinkHref(e.target.value)}
                  placeholder="https://"
                />
              </AdminField>
            </InsertDialog>

            <AdminField label="Markdown body" htmlFor={`markdown-${id}`}>
              <Textarea
                ref={markdownRef}
                id={`markdown-${id}`}
                variant="box"
                value={bodyMarkdown}
                onChange={(e) => setBodyMarkdown(e.target.value)}
                rows={16}
                className="min-h-64 font-mono text-sm"
                placeholder={`## Appointments\n\nPaste your policy copy here.\n\n- Point one\n- Point two`}
              />
            </AdminField>
            {!parseResult.ok ? (
              <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Markdown error: {parseResult.error}
              </p>
            ) : null}
          </AdminSection>

          <AdminSection title="Visibility">
            <div className="flex flex-wrap gap-6">
              <AdminToggle
                name="visible"
                label="Visible on policies page"
                defaultChecked={policy?.visible ?? true}
              />
              <AdminToggle
                name="showInToc"
                label="Show in table of contents"
                description="Include in the policies page TOC nav"
                defaultChecked={policy?.showInToc ?? false}
              />
              <AdminToggle
                name="showOnAbout"
                label="Show on About page"
                description="Include in About page teaser cards"
                defaultChecked={policy?.showOnAbout ?? false}
              />
            </div>
          </AdminSection>

          {state.error ? (
            <p className="text-sm text-red-700">{state.error}</p>
          ) : null}
          {state.success ? (
            <p className="text-sm text-brand-dark">{state.success}</p>
          ) : null}

          <Button type="submit" disabled={pending || !canSave}>
            {pending ? "Saving…" : policy ? "Save changes" : "Create policy"}
          </Button>
        </form>
      </div>

      <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <div className="overflow-hidden border border-ink/10 bg-stone/20">
          <div className="border-b border-ink/10 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Preview
            </p>
          </div>
          <div className="max-h-[28rem] overflow-y-auto p-4 sm:p-5">
            <h2 className="font-display text-2xl tracking-tight text-ink">
              {title || "Policy title"}
            </h2>
            {previewBlocks.length > 0 ? (
              <div className="mt-4 text-sm">
                <ArticleBlocks blocks={previewBlocks} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">No body content yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
