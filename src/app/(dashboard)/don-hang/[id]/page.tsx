import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { OrderStatusForm } from "./order-status-form";

export const metadata = { title: "Chi tiết đơn hàng" };

type OrderItemRow = {
  product_name: string;
  product_image: string | null;
  price: number;
  qty: number;
};

function formatVnd(value: number): string {
  return value.toLocaleString("vi-VN") + "₫";
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("vi-VN");
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", parseInt(id))
    .single();

  if (error || !order) return notFound();

  const items: OrderItemRow[] = order.order_items ?? [];

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-900">
          <Link href="/don-hang" className="transition hover:text-zinc-700">
            Đơn hàng
          </Link>
          <span>/</span>
          <span>{order.order_code}</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-900">{order.order_code}</h1>
        <p className="mt-1 text-sm text-zinc-900">Đặt ngày {formatDate(order.created_at)}</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Trạng thái đơn hàng</h2>
        <OrderStatusForm id={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Thông tin giao hàng</h2>
          <div className="space-y-1 text-sm text-zinc-900">
            <p className="font-medium text-zinc-900">{order.full_name}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
            <p>
              {order.address}, {order.city}
            </p>
            {order.note && <p className="mt-2 text-zinc-900">Ghi chú: {order.note}</p>}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Thanh toán</h2>
          <p className="text-sm text-zinc-900">
            {order.payment_method === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">Sản phẩm ({items.length})</h2>
        <div className="divide-y divide-zinc-100">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                {item.product_image && (
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" unoptimized />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{item.product_name}</p>
                <p className="text-xs text-zinc-900">
                  SL: {item.qty} × {formatVnd(item.price)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-zinc-900">{formatVnd(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm">
          <div className="flex items-center justify-between text-zinc-900">
            <span>Tạm tính</span>
            <span>{formatVnd(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-900">
            <span>Phí vận chuyển</span>
            <span>{order.shipping_fee === 0 ? "Miễn phí" : formatVnd(order.shipping_fee)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-base font-semibold text-zinc-900">
            <span>Tổng cộng</span>
            <span>{formatVnd(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
