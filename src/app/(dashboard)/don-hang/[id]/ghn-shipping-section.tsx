"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Toast } from "@/components/toast";
import { createGhnShippingOrder } from "../actions";

type Order = {
  id: number;
  ghn_order_code: string | null;
  ghn_status: string | null;
  to_district_id: number | null;
  to_ward_code: string | null;
};

export function GhnShippingSection({ order }: { order: Order }) {
  const [state, action, pending] = useActionState(createGhnShippingOrder, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && state?.success) setSaved(true);
    prevPending.current = pending;
  }, [pending, state]);

  if (order.ghn_order_code) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Vận đơn GHN</h2>
        <p className="text-sm text-zinc-900">
          Mã vận đơn: <span className="font-semibold">{order.ghn_order_code}</span>
        </p>
        {order.ghn_status && <p className="mt-1 text-sm text-zinc-500">Trạng thái GHN: {order.ghn_status}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      {saved && <Toast message="Đã tạo vận đơn GHN" onDone={() => setSaved(false)} />}
      <h2 className="mb-3 text-sm font-semibold text-zinc-900">Vận đơn GHN</h2>

      {!order.to_district_id || !order.to_ward_code ? (
        <p className="text-sm text-zinc-500">
          Đơn hàng này thiếu thông tin quận/huyện, phường/xã (đặt trước khi bật GHN) nên không thể tạo vận đơn tự
          động.
        </p>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="orderId" value={order.id} />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Đang tạo..." : "Tạo vận đơn GHN"}
          </button>
        </form>
      )}
    </div>
  );
}
