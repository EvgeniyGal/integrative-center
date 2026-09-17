"use client";

import { MessageCircle, Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ChatMarkdown } from "@/components/chat/ChatMarkdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hbi-chat-widget-v1";
const MAX_STORED = 40;
const INVITE_DELAY_MS = 30_000;

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type StoredState = {
  messages: ChatMessage[];
  inviteDismissed: boolean;
};

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], inviteDismissed: false };
    const parsed = JSON.parse(raw) as StoredState;
    return {
      messages: Array.isArray(parsed.messages)
        ? parsed.messages.slice(-MAX_STORED)
        : [],
      inviteDismissed: Boolean(parsed.inviteDismissed),
    };
  } catch {
    return { messages: [], inviteDismissed: false };
  }
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages: state.messages.slice(-MAX_STORED),
        inviteDismissed: state.inviteDismissed,
      }),
    );
  } catch {
    // Ignore quota / private mode.
  }
}

export function ChatWidget({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = loadState();
    setMessages(stored.messages);
    setInviteDismissed(stored.inviteDismissed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ messages, inviteDismissed });
  }, [ready, messages, inviteDismissed]);

  useEffect(() => {
    if (!ready || inviteDismissed || open) return;
    const timer = window.setTimeout(() => setInviteVisible(true), INVITE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [ready, inviteDismissed, open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const node = transcriptRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, open, pending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const mobile = window.matchMedia("(max-width: 639px)");
    const previous = document.body.style.overflow;
    const sync = () => {
      document.body.style.overflow = mobile.matches ? "hidden" : previous;
    };
    sync();
    mobile.addEventListener("change", sync);
    return () => {
      document.body.style.overflow = previous;
      mobile.removeEventListener("change", sync);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function dismissInvite() {
    setInviteVisible(false);
    setInviteDismissed(true);
  }

  function openChat() {
    setOpen(true);
    setInviteVisible(false);
    setInviteDismissed(true);
  }

  function closeChat() {
    setOpen(false);
  }

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || pending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const history = [...messages, userMessage];
    const assistantId = crypto.randomUUID();

    setInput("");
    setError(null);
    setPending(true);
    setMessages([
      ...history,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        let message = "The assistant could not reply. Please try again.";
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) message = payload.error;
        } catch {
          // Keep default message.
        }
        setError(message);
        setMessages(history);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const snapshot = assembled;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: snapshot }
              : message,
          ),
        );
      }
    } catch {
      setError("The assistant could not reply. Please try again.");
      setMessages(history);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {inviteVisible && !open ? (
        <div
          className="fixed z-40 w-[min(18rem,calc(100vw-5.5rem))] right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(5.25rem,calc(env(safe-area-inset-bottom)+4rem))] lg:right-10 lg:bottom-[5.75rem]"
          role="status"
        >
          <div className="relative rounded-2xl border border-ink/10 bg-ivory px-4 py-3 shadow-[0_18px_40px_-20px_rgba(28,27,25,0.45)]">
            <button
              type="button"
              className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5 hover:text-ink"
              aria-label="Dismiss invitation"
              onClick={dismissInvite}
            >
              <X className="size-3.5" />
            </button>
            <p className="pr-6 text-sm leading-relaxed text-ink">
              Ask us anything about the practice.
            </p>
            <button
              type="button"
              className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-brand hover:text-brand-dark"
              onClick={openChat}
            >
              Open chat
            </button>
          </div>
        </div>
      ) : null}

      {open ? (
        <button
          type="button"
          aria-label="Close chat overlay"
          className="fixed inset-0 z-40 bg-ink/40 sm:hidden"
          onClick={closeChat}
        />
      ) : null}

      {open ? (
        <section
          aria-label="Practice assistant"
          className={cn(
            "fixed z-50 flex min-h-0 flex-col overflow-hidden border border-ink/10 bg-ivory shadow-[0_24px_60px_-24px_rgba(28,27,25,0.45)]",
            "left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] top-[max(5.5rem,env(safe-area-inset-top))] bottom-[max(0.75rem,env(safe-area-inset-bottom))]",
            "sm:left-auto sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:top-auto sm:bottom-[max(5.5rem,env(safe-area-inset-bottom))] sm:h-[min(36rem,calc(100dvh-7.5rem))] sm:w-[22rem]",
            "lg:right-10 lg:bottom-24",
          )}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-ink/10 bg-brand px-4 py-3 text-white">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                Assistant
              </p>
              <h2 className="font-display text-xl leading-tight">
                Health & Beauty Integrative Center
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Clear conversation"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
              >
                <Trash2 className="size-4" />
              </button>
              <button
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
                onClick={closeChat}
              >
                <X className="size-4" />
              </button>
            </div>
          </header>

          <div
            ref={transcriptRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted">
                Ask about our services, hours, location, or how to request a
                consult. This is not medical advice.
              </p>
            ) : null}
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <p className="max-w-[90%] rounded-2xl rounded-br-md bg-brand px-3 py-2 text-sm text-white">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="max-w-[95%]">
                  {message.content ? (
                    <ChatMarkdown text={message.content} />
                  ) : (
                    <p className="text-sm text-muted">Thinking…</p>
                  )}
                </div>
              ),
            )}
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </div>

          <form
            className="shrink-0 border-t border-ink/10 bg-ivory p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
          >
            <label className="sr-only" htmlFor="chat-message">
              Your question
            </label>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                id="chat-message"
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Ask a question…"
                disabled={pending}
                className="max-h-28 min-h-11 flex-1 resize-none border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <Button
                type="submit"
                size="icon"
                disabled={pending || !input.trim()}
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {!open ? (
        <Button
          type="button"
          size="icon"
          aria-label="Open practice assistant"
          onClick={openChat}
          className="fixed z-40 right-[max(1.5rem,env(safe-area-inset-right))] bottom-[max(1.5rem,env(safe-area-inset-bottom))] lg:right-10 lg:bottom-10"
        >
          <MessageCircle className="size-5" />
        </Button>
      ) : null}
    </>
  );
}
