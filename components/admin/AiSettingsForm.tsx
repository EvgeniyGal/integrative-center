"use client";

import { useActionState } from "react";

import { saveAiSettingsAction } from "@/app/admin/actions/settings";
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

export function AiSettingsForm({
  enabled,
  hasStoredKey,
  systemPrompt,
  knowledgeBase,
  chatModel,
  contentModel,
  productModel,
  models,
}: {
  enabled: boolean;
  hasStoredKey: boolean;
  systemPrompt: string;
  knowledgeBase: string;
  chatModel: string;
  contentModel: string;
  productModel: string;
  models: string[];
}) {
  const [state, formAction, pending] = useActionState(
    saveAiSettingsAction,
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
              ? "A key is saved. Leave blank to keep it."
              : "Required for the chat widget and AI drafts."
          }
        >
          <Input
            id="openaiApiKey"
            name="openaiApiKey"
            variant="box"
            type="password"
            autoComplete="off"
            placeholder={hasStoredKey ? "••••••••••••••••" : "sk-..."}
          />
        </AdminField>
        {hasStoredKey ? (
          <AdminToggle
            name="clearApiKey"
            label="Remove saved key"
            description="Remove the saved key. Chat and AI drafts will stop until you add a new one."
          />
        ) : null}
        <AdminToggle
          name="enabled"
          label="Show chat widget"
          description="When off, visitors will not see the assistant on the public site."
          defaultChecked={enabled}
        />
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

      <AdminSection
        title="Chat knowledge"
        description="The assistant uses this prompt and knowledge base, plus live services, hours, and contact details from the site."
      >
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

      {state.error ? (
        <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="border border-brand/20 bg-brand-light/40 px-3 py-2 text-sm text-brand-dark">
          {state.success}
        </p>
      ) : null}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-3 border border-ink/10 bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_rgba(28,27,25,0.06)] backdrop-blur">
        <p className="text-xs text-muted">Changes apply after you save.</p>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
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
