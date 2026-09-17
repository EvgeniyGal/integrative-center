"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";

import {
  revealOpenAiApiKeyAction,
  saveKnowledgeSettingsAction,
  saveOpenAiSettingsAction,
} from "@/app/admin/actions/settings";
import type { ActionState } from "@/app/admin/actions/auth";
import {
  AdminField,
  AdminSection,
  AdminToggle,
} from "@/components/admin/AdminField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

function SaveBar({ pending }: { pending: boolean }) {
  return (
    <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 border border-ink/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_rgba(28,27,25,0.06)] backdrop-blur">
      <p className="text-xs text-muted">Changes apply after you save.</p>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}

export function OpenAiSettingsForm({
  hasStoredKey,
  chatModel,
  contentModel,
  productModel,
  models,
}: {
  hasStoredKey: boolean;
  chatModel: string;
  contentModel: string;
  productModel: string;
  models: string[];
}) {
  const [state, formAction, pending] = useActionState(
    saveOpenAiSettingsAction,
    {} as ActionState,
  );
  const options = uniqueModels(models, [chatModel, contentModel, productModel]);

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      <AdminSection
        title="OpenAI"
        description="The key is stored encrypted and never sent to the public site. Chat and AI drafts use only the key saved here."
      >
        <AdminField
          label="API key"
          htmlFor="openaiApiKey"
          hint={
            hasStoredKey
              ? "A key is saved. Leave blank to keep it, or show it to review."
              : "Required for the chat widget and AI drafts."
          }
        >
          <ApiKeyField hasStoredKey={hasStoredKey} />
        </AdminField>
      </AdminSection>

      <AdminSection
        title="Models"
        description="Available models come from your OpenAI account. Each job can use a different model."
      >
        <ModelSelect
          id="chatModel"
          name="chatModel"
          label="Chatbot"
          hint="Public website assistant"
          value={chatModel}
          options={options}
        />
        <ModelSelect
          id="contentModel"
          name="contentModel"
          label="Content"
          hint="Service and article draft assist"
          value={contentModel}
          options={options}
        />
        <ModelSelect
          id="productModel"
          name="productModel"
          label="Products"
          hint="Recommended product draft assist"
          value={productModel}
          options={options}
        />
      </AdminSection>

      <FormStatus state={state} />
      <SaveBar pending={pending} />
    </form>
  );
}

export function KnowledgeSettingsForm({
  enabled,
  systemPrompt,
  knowledgeBase,
}: {
  enabled: boolean;
  systemPrompt: string;
  knowledgeBase: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveKnowledgeSettingsAction,
    {} as ActionState,
  );

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-5">
      <AdminSection
        title="Chat knowledge"
        description="The assistant uses this prompt and knowledge base, plus live services, hours, and contact details from the site."
      >
        <AdminToggle
          name="enabled"
          label="Show chat widget"
          description="When off, visitors will not see the assistant on the public site."
          defaultChecked={enabled}
        />
        <AdminField label="System prompt" htmlFor="systemPrompt">
          <Textarea
            id="systemPrompt"
            name="systemPrompt"
            variant="box"
            rows={10}
            defaultValue={systemPrompt}
            required
          />
        </AdminField>
        <AdminField label="Knowledge base" htmlFor="knowledgeBase">
          <Textarea
            id="knowledgeBase"
            name="knowledgeBase"
            variant="box"
            rows={12}
            defaultValue={knowledgeBase}
            required
          />
        </AdminField>
      </AdminSection>

      <FormStatus state={state} />
      <SaveBar pending={pending} />
    </form>
  );
}

function ApiKeyField({ hasStoredKey }: { hasStoredKey: boolean }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleVisibility() {
    if (visible) {
      if (revealed && value === revealed) setValue("");
      setVisible(false);
      return;
    }

    if (!value && hasStoredKey && !revealed) {
      setBusy(true);
      setError(null);
      const result = await revealOpenAiApiKeyAction();
      setBusy(false);
      if ("error" in result) {
        setError(result.error ?? "No API key is saved.");
        return;
      }
      setRevealed(result.key);
      setValue(result.key);
    }

    setVisible(true);
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id="openaiApiKey"
          name="openaiApiKey"
          variant="box"
          type={visible ? "text" : "password"}
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={hasStoredKey ? "••••••••••••••••" : "sk-..."}
          className="pr-24"
        />
        <button
          type="button"
          onClick={() => void toggleVisibility()}
          disabled={busy || (!value && !hasStoredKey)}
          aria-label={visible ? "Hide API key" : "Show API key"}
          className="absolute right-1.5 top-1/2 inline-flex h-9 -translate-y-1/2 items-center gap-1.5 px-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted transition hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {busy ? "…" : visible ? "Hide" : "Show"}
        </button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function ModelSelect({
  id,
  name,
  label,
  hint,
  value,
  options,
}: {
  id: string;
  name: string;
  label: string;
  hint: string;
  value: string;
  options: string[];
}) {
  return (
    <AdminField label={label} htmlFor={id} hint={hint}>
      <Select id={id} name={name} variant="box" defaultValue={value} required>
        {options.map((model) => (
          <option key={`${id}-${model}`} value={model}>
            {model}
          </option>
        ))}
      </Select>
    </AdminField>
  );
}

function uniqueModels(models: string[], extras: string[]) {
  return [...new Set([...extras.filter(Boolean), ...models])];
}
