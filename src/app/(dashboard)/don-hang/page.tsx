import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Đơn hàng" };

function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN") + "₫";
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("vi-VN");
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  shipping: "border-purple-200 bg-purple-50 text-purple-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

export default async function DonHangPage() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_code, full_name, phone, total, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <span>Đơn hàng</span>
          <span>/</span>
          <span>Danh sách đơn hàng</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">Đơn hàng</h1>
        <p className="mt-1 text-sm text-zinc-500">Toàn bộ đơn hàng khách đặt trên veritygear.</p>
      </div>

      <h2 className="text-base font-semibold text-zinc-900">Danh sách ({orders?.length ?? 0})</h2>

      {error ? (
        <p className="text-sm text-red-500">
          Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL (migrations/035_create_orders.sql) trong
          Supabase SQL Editor.
        </p>
      ) : (
        <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
          {orders && orders.length > 0 ? (
            orders.map((o) => (
              <Link
                key={o.id}
                href={`/don-hang/${o.id}`}
                className="flex items-center gap-4 bg-white px-4 py-3 transition hover:bg-zinc-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">{o.order_code}</span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLES[o.status] ?? "border-zinc-200 bg-zinc-50 text-zinc-600"}`}
                    >
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-zinc-400">
                    {o.full_name} · {o.phone} · {formatDate(o.created_at)}
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-zinc-900">{formatVnd(o.total)}</span>
              </Link>
            ))
          ) : (
            <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">Chưa có đơn hàng nào.</div>
          )}
        </div>
      )}
    </div>
  );
}
