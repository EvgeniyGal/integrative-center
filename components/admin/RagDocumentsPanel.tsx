"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import {
  createRagDocumentAction,
  deleteRagDocumentAction,
  reindexRagDocumentAction,
  toggleRagDocumentAction,
} from "@/app/admin/actions/rag";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/AdminTable";
import { DocumentField } from "@/components/admin/DocumentField";
import { DeleteButton } from "@/components/admin/TableActions";
import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { RagDocument } from "@/lib/db/schema";

type SerializedDocument = Omit<RagDocument, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

type TestSource = {
  title: string;
  description: string | null;
  excerpt: string;
};

type TestMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function FormStatus({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p className="border border-brand/20 bg-brand-light/40 px-3 py-2 text-sm text-brand-dark">
        {state.success}
      </p>
    );
  }
  return null;
}

function statusLabel(status: string) {
  if (status === "ready") return "Ready";
  if (status === "processing") return "Processing";
  if (status === "failed") return "Failed";
  return status;
}

export function RagDocumentsPanel({
  documents,
}: {
  documents: SerializedDocument[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileFieldKey, setFileFieldKey] = useState(0);
  const [state, formAction, pending] = useActionState(
    createRagDocumentAction,
    {} as ActionState,
  );
  const [reindexState, setReindexState] = useState<ActionState>({});
  const [reindexPending, startReindex] = useTransition();

  const [testInput, setTestInput] = useState("");
  const [testPending, setTestPending] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [testSources, setTestSources] = useState<TestSource[]>([]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setFileFieldKey((key) => key + 1);
    }
  }, [state.success]);

  async function sendTestQuestion(text: string) {
    const question = text.trim();
    if (!question || testPending) return;

    const userMessage: TestMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    const assistantId = crypto.randomUUID();

    setTestInput("");
    setTestError(null);
    setTestPending(true);
    setTestSources([]);
    setTestMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/admin/rag-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok || !response.body) {
        let message = "Test query failed.";
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) message = payload.error;
        } catch {
          // keep default
        }
        setTestError(message);
        setTestMessages((current) =>
          current.filter((m) => m.id !== assistantId && m.id !== userMessage.id),
        );
        return;
      }

      const encodedSources = response.headers.get("x-rag-sources");
      if (encodedSources) {
        try {
          const decoded = JSON.parse(atob(encodedSources)) as TestSource[];
          setTestSources(decoded);
        } catch {
          setTestSources([]);
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const snapshot = assembled;
        setTestMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: snapshot }
              : message,
          ),
        );
      }
    } catch {
      setTestError("Test query failed.");
      setTestMessages((current) =>
        current.filter((m) => m.id !== assistantId && m.id !== userMessage.id),
      );
    } finally {
      setTestPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <AdminSection
        title="Add document"
        description="Upload a PDF, Word (.docx), or TXT file. Title and optional description help the assistant understand when to use it."
      >
        <form ref={formRef} action={formAction} className="space-y-4">
          <AdminField label="Title" htmlFor="rag-title" hint="Required">
            <Input
              id="rag-title"
              name="title"
              required
              variant="box"
              placeholder="Patient intake FAQ"
            />
          </AdminField>
          <AdminField
            label="Description"
            htmlFor="rag-description"
            hint="Optional context for retrieval"
          >
            <Textarea
              id="rag-description"
              name="description"
              rows={3}
              variant="box"
              className="min-h-28 border border-ink/20 bg-white px-3 py-3 shadow-[inset_0_1px_0_rgba(28,27,25,0.03)] focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="Use for questions about scheduling, forms, and first visits."
            />
          </AdminField>
          <DocumentField
            key={fileFieldKey}
            label="File"
            name="file"
            required
            hint="PDF, DOCX, or TXT · max 10MB"
          />
          <AdminToggle
            name="enabled"
            label="Enabled for public chat"
            defaultChecked
            description="When off, the document stays indexed for admin testing only."
          />
          <FormStatus state={state} />
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? "Indexing…" : "Upload & index"}
            </Button>
          </div>
        </form>
      </AdminSection>

      <AdminSection
        title="Documents"
        description="Indexed files used by hybrid retrieval alongside the plain-text knowledge base."
      >
        {documents.length === 0 ? (
          <p className="text-sm text-muted">No RAG documents yet.</p>
        ) : (
          <AdminTable>
            <AdminTableElement>
              <AdminTableHead>
                <AdminTableRow>
                  <AdminTableHeaderCell>Document</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Chunks</AdminTableHeaderCell>
                  <AdminTableHeaderCell className="text-right">
                    Actions
                  </AdminTableHeaderCell>
                </AdminTableRow>
              </AdminTableHead>
              <AdminTableBody>
                {documents.map((doc) => (
                  <AdminTableRow key={doc.id}>
                    <AdminTableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-ink">{doc.title}</p>
                        <p className="text-xs text-muted">{doc.fileName}</p>
                        {doc.description ? (
                          <p className="text-xs text-muted line-clamp-2">
                            {doc.description}
                          </p>
                        ) : null}
                        {doc.error ? (
                          <p className="text-xs text-red-600">{doc.error}</p>
                        ) : null}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="text-sm">{statusLabel(doc.status)}</span>
                      <p className="text-xs text-muted">
                        {doc.enabled ? "Enabled" : "Disabled"}
                      </p>
                    </AdminTableCell>
                    <AdminTableCell>
                      <span className="text-sm">{doc.chunkCount}</span>
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <form action={toggleRagDocumentAction}>
                          <input type="hidden" name="id" value={doc.id} />
                          <input
                            type="hidden"
                            name="enabled"
                            value={doc.enabled ? "false" : "true"}
                          />
                          <Button type="submit" variant="outline" size="sm">
                            {doc.enabled ? "Disable" : "Enable"}
                          </Button>
                        </form>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={reindexPending}
                          onClick={() => {
                            startReindex(async () => {
                              const fd = new FormData();
                              fd.set("id", doc.id);
                              const result = await reindexRagDocumentAction(fd);
                              setReindexState(result);
                            });
                          }}
                        >
                          Reindex
                        </Button>
                        <DeleteButton
                          action={deleteRagDocumentAction}
                          id={doc.id}
                          label={`Delete ${doc.title}`}
                        />
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTableElement>
          </AdminTable>
        )}
        <FormStatus state={reindexState} />
      </AdminSection>

      <AdminSection
        title="Test retrieval"
        description="Ask a question as if you were a visitor. The answer uses the same hybrid RAG path as the public chat, including disabled documents for admin testing."
      >
        <div className="space-y-4">
          <div className="max-h-[28rem] space-y-3 overflow-y-auto border border-ink/10 bg-white p-4">
            {testMessages.length === 0 ? (
              <p className="text-sm text-muted">
                Ask something that should be answered from an uploaded document.
              </p>
            ) : (
              testMessages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-8 rounded-lg bg-brand/10 px-3 py-2 text-sm text-ink"
                      : "mr-4 space-y-2 text-sm text-ink"
                  }
                >
                  {message.role === "assistant" ? (
                    message.content ? (
                      <ChatMarkdown text={message.content} />
                    ) : (
                      <p className="text-muted">Thinking…</p>
                    )
                  ) : (
                    message.content
                  )}
                </div>
              ))
            )}
          </div>

          {testSources.length > 0 ? (
            <div className="space-y-2 border border-ink/10 bg-stone/20 p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/70">
                Sources used
              </p>
              <ul className="space-y-2">
                {testSources.map((source, index) => (
                  <li key={`${source.title}-${index}`} className="text-sm">
                    <p className="font-medium text-ink">{source.title}</p>
                    {source.description ? (
                      <p className="text-xs text-muted">{source.description}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-muted">{source.excerpt}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {testError ? (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {testError}
            </p>
          ) : null}

          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void sendTestQuestion(testInput);
            }}
          >
            <Input
              value={testInput}
              onChange={(event) => setTestInput(event.target.value)}
              placeholder="Ask a question about an uploaded document…"
              variant="box"
              disabled={testPending}
              className="flex-1"
            />
            <Button type="submit" disabled={testPending || !testInput.trim()}>
              {testPending ? "Asking…" : "Ask"}
            </Button>
          </form>
        </div>
      </AdminSection>
    </div>
  );
}
