"use client";

import { useActionState } from "react";

import {
  addNotificationRecipientAction,
  deleteNotificationRecipientAction,
  sendTestNotificationAction,
  updateNotificationRecipientAction,
} from "@/app/admin/actions/settings";
import type { ActionState } from "@/app/admin/actions/auth";
import { AdminSection } from "@/components/admin/AdminField";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/TableActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NotificationRecipient } from "@/lib/db/schema";
import { site } from "@/lib/site";

type SerializedRecipient = Omit<
  NotificationRecipient,
  "createdAt" | "updatedAt"
> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

export function NotificationRecipientsPanel({
  recipients,
}: {
  recipients: SerializedRecipient[];
}) {
  const [state, formAction, pending] = useActionState(
    addNotificationRecipientAction,
    {} as ActionState,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <AdminSection
        title="Add recipient"
        description="Each address can receive consult requests, newsletter signups, or both."
      >
        <form action={formAction} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="recipient-email"
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70"
              >
                Email
              </label>
              <Input
                id="recipient-email"
                name="email"
                type="email"
                required
                variant="box"
                placeholder="office@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="recipient-label"
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70"
              >
                Label
              </label>
              <Input
                id="recipient-label"
                name="label"
                variant="box"
                placeholder="Front desk"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="receiveContact"
                defaultChecked
                className="size-4 accent-brand"
              />
              Contact requests
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="receiveNewsletter"
                defaultChecked
                className="size-4 accent-brand"
              />
              Newsletter signups
            </label>
          </div>
          {state.error ? (
            <p className="text-sm text-red-700">{state.error}</p>
          ) : null}
          {state.success ? (
            <p className="text-sm text-brand-dark">{state.success}</p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Adding…" : "Add email"}
          </Button>
        </form>
      </AdminSection>

      <AdminSection
        title="Who receives messages"
        description={
          recipients.length === 0
            ? `Until you add someone, ${site.email} receives both contact requests and newsletter signups.`
            : "Turn types on or off for each address. Changes save immediately."
        }
      >
        <AdminTable>
          <AdminTableElement>
            <AdminTableHead>
              <tr>
                <AdminTableHeaderCell>Email</AdminTableHeaderCell>
                <AdminTableHeaderCell>Contact</AdminTableHeaderCell>
                <AdminTableHeaderCell>Newsletter</AdminTableHeaderCell>
                <AdminTableHeaderCell className="text-right">
                  Actions
                </AdminTableHeaderCell>
              </tr>
            </AdminTableHead>
            <AdminTableBody>
              {recipients.length === 0 ? (
                <AdminTableRow>
                  <AdminTableCell colSpan={4} className="py-10 text-muted">
                    No custom recipients yet.
                  </AdminTableCell>
                </AdminTableRow>
              ) : (
                recipients.map((recipient) => (
                  <AdminTableRow key={recipient.id}>
                    <AdminTableCell>
                      <p className="font-medium text-ink">{recipient.email}</p>
                      {recipient.label ? (
                        <p className="text-xs text-muted">{recipient.label}</p>
                      ) : null}
                    </AdminTableCell>
                    <AdminTableCell>
                      <ChannelToggle
                        id={recipient.id}
                        receiveContact={recipient.receiveContact}
                        receiveNewsletter={recipient.receiveNewsletter}
                        channel="receiveContact"
                        label={`Contact requests for ${recipient.email}`}
                      />
                    </AdminTableCell>
                    <AdminTableCell>
                      <ChannelToggle
                        id={recipient.id}
                        receiveContact={recipient.receiveContact}
                        receiveNewsletter={recipient.receiveNewsletter}
                        channel="receiveNewsletter"
                        label={`Newsletter signups for ${recipient.email}`}
                      />
                    </AdminTableCell>
                    <AdminTableCell>
                      <div className="flex justify-end">
                        <DeleteButton
                          action={deleteNotificationRecipientAction}
                          id={recipient.id}
                          label={recipient.email}
                        />
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))
              )}
            </AdminTableBody>
          </AdminTableElement>
        </AdminTable>
      </AdminSection>

      <TestNotificationForm />
    </div>
  );
}

function TestNotificationForm() {
  const [state, formAction, pending] = useActionState(
    sendTestNotificationAction,
    {} as ActionState,
  );

  return (
    <AdminSection
      title="Send a test"
      description="Resend only delivers to arbitrary inboxes after you verify a sending domain (for example hbintegrative.com). Until then, test from this page to see the exact delivery error."
    >
      <form action={formAction} className="space-y-4">
        <fieldset className="flex flex-wrap gap-4">
          <legend className="sr-only">Message type</legend>
          <label className="inline-flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="channel"
              value="contact"
              defaultChecked
              className="size-4 accent-brand"
            />
            Contact requests
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="channel"
              value="newsletter"
              className="size-4 accent-brand"
            />
            Newsletter signups
          </label>
        </fieldset>
        {state.error ? (
          <p className="text-sm text-red-700">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-brand-dark">{state.success}</p>
        ) : null}
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Sending…" : "Send test email"}
        </Button>
      </form>
    </AdminSection>
  );
}

function ChannelToggle({
  id,
  receiveContact,
  receiveNewsletter,
  channel,
  label,
}: {
  id: string;
  receiveContact: boolean;
  receiveNewsletter: boolean;
  channel: "receiveContact" | "receiveNewsletter";
  label: string;
}) {
  const checked =
    channel === "receiveContact" ? receiveContact : receiveNewsletter;

  return (
    <form action={updateNotificationRecipientAction} key={`${id}-${channel}-${checked}`}>
      <input type="hidden" name="id" value={id} />
      {channel === "receiveContact" ? (
        <input type="hidden" name="receiveNewsletter" value={receiveNewsletter ? "on" : ""} />
      ) : (
        <input
          type="hidden"
          name="receiveContact"
          value={receiveContact ? "on" : ""}
        />
      )}
      <input
        type="checkbox"
        name={channel}
        defaultChecked={checked}
        aria-label={label}
        className="size-4 accent-brand"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      />
    </form>
  );
}
