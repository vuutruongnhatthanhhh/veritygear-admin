"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Field, inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertGhnSettings, testGhnConnection } from "./ghn-actions";

type GhnSettings = {
  enabled: boolean;
  token: string;
  shop_id: string;
  service_type_id: number;
} | null;

export function GhnSettingsForm({ settings }: { settings: GhnSettings }) {
  const [error, action, pending] = useActionState(upsertGhnSettings, null);
  const [testState, testAction, testPending] = useActionState(testGhnConnection, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  // Controlled so "Kiểm tra kết nối" always tests whatever is currently
  // typed here — a hidden input reading the `settings` prop would test a
  // stale value after save, since this component doesn't refetch on its own.
  const [tokenValue, setTokenValue] = useState(settings?.token ?? "");

  useEffect(() => {
    if (prevPending.current && !pending && !error) setSaved(true);
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <div className="space-y-6">
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <form action={action} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="enabled" defaultChecked={settings?.enabled ?? false} className="rounded border-zinc-300" />
          Bật tính phí vận chuyển tự động qua GHN
        </label>

        <Field label="Token (từ tài khoản GHN)">
          <input
            name="token"
            value={tokenValue}
            onChange={(e) => setTokenValue(e.target.value)}
            className={inputCls}
            autoComplete="off"
          />
        </Field>

        <Field label="ShopId (mã shop trên GHN)">
          <input name="shop_id" defaultValue={settings?.shop_id ?? ""} className={inputCls} autoComplete="off" />
        </Field>

        <Field label="Loại dịch vụ vận chuyển">
          <select
            name="service_type_id"
            defaultValue={settings?.service_type_id ?? 2}
            className={`${inputCls} max-w-60`}
          >
            <option value={2}>Hàng nhẹ — dưới 20kg (tiêu chuẩn)</option>
            <option value={5}>Hàng nặng — trên 20kg</option>
          </select>
        </Field>
        <p className="-mt-4 text-xs text-zinc-400">
          Hàng nhẹ: đơn hàng dưới 20kg (đa số sản phẩm). Hàng nặng: đơn hàng trên 20kg, cồng kềnh.
        </p>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>

      <div className="border-t border-zinc-100 pt-6">
        <form action={testAction} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="token" value={tokenValue} readOnly />
          <button
            type="submit"
            disabled={testPending}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {testPending ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
          </button>
          {testState?.success && <span className="text-sm text-emerald-600">{testState.success}</span>}
          {testState?.error && <span className="text-sm text-red-600">{testState.error}</span>}
        </form>
      </div>
    </div>
  );
}
