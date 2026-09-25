"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertContactSettings } from "./actions";

type Settings = { recipient_email: string } | null;

export function ContactSettingsForm({ settings }: { settings: Settings }) {
  const [error, action, pending] = useActionState(upsertContactSettings, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      setSaved(true);
    }
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="max-w-sm space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Email nhận tin nhắn</label>
        <input
          name="recipient_email"
          type="email"
          required
          defaultValue={settings?.recipient_email ?? ""}
          placeholder="hello@veritygear.vn"
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
