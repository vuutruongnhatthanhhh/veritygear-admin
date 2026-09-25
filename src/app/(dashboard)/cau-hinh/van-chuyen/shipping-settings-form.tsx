"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Field, inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertShippingSettings } from "./actions";

type ShippingSettings = {
  free_shipping_threshold: number;
  shipping_fee: number;
} | null;

export function ShippingSettingsForm({ settings }: { settings: ShippingSettings }) {
  const [error, action, pending] = useActionState(upsertShippingSettings, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) setSaved(true);
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <Field label="Phí vận chuyển (₫)">
        <input
          name="shipping_fee"
          type="number"
          min={0}
          defaultValue={settings?.shipping_fee ?? 35000}
          required
          className={inputCls}
        />
      </Field>

      <Field label="Miễn phí vận chuyển từ đơn hàng (₫)">
        <input
          name="free_shipping_threshold"
          type="number"
          min={0}
          defaultValue={settings?.free_shipping_threshold ?? 1500000}
          required
          className={inputCls}
        />
      </Field>
      <p className="-mt-4 text-xs text-zinc-400">
        Đơn hàng có tạm tính từ mức này trở lên sẽ được miễn phí vận chuyển.
      </p>

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
