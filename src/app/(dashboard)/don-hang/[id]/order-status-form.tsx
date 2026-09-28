"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Toast } from "@/components/toast";
import { updateOrderStatus } from "../actions";

const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã hủy" },
];

export function OrderStatusForm({
  id,
  status,
  hasGhnOrder,
}: {
  id: number;
  status: string;
  hasGhnOrder?: boolean;
}) {
  const [error, action, pending] = useActionState(updateOrderStatus, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) setSaved(true);
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <div className="space-y-3">
      {hasGhnOrder && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Đơn này đang do GHN quản lý vận chuyển — trạng thái sẽ tự động cập nhật theo webhook GHN. Đổi tay ở đây có
          thể bị webhook ghi đè lại khi GHN báo trạng thái mới.
        </p>
      )}
      <form action={action} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={id} />
        {saved && <Toast message="Đã cập nhật trạng thái" onDone={() => setSaved(false)} />}

        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:outline-none focus:ring-2 focus:ring-zinc-900"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : "Cập nhật trạng thái"}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </form>
    </div>
  );
}
