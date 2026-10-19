"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Field, inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertExchangeRateSettings } from "./actions";

type Settings = { usd_to_vnd_rate: number } | null;

export function ExchangeRateForm({ settings }: { settings: Settings }) {
  const [error, action, pending] = useActionState(upsertExchangeRateSettings, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) setSaved(true);
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="max-w-sm space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <Field label="1 USD = ? VNĐ">
        <input
          name="usd_to_vnd_rate"
          type="number"
          min={1}
          step="0.01"
          defaultValue={settings?.usd_to_vnd_rate ?? 25000}
          required
          className={inputCls}
        />
      </Field>

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
