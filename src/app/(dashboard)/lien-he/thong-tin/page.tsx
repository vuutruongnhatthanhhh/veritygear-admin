import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteContactCardButton } from "./delete-contact-card-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Thông tin liên hệ - Liên hệ" };

const ICON_LABELS: Record<string, string> = {
  location: "Địa chỉ",
  phone: "Điện thoại",
  email: "Email",
  hours: "Giờ làm việc",
};

export default async function ThongTinPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("contact_info_cards").select("*").order("sort_order");

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/lien-he/banner" className="transition hover:text-zinc-700">
            Liên hệ
          </Link>
          <span>/</span>
          <span>Thông tin liên hệ</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Thông tin liên hệ</h1>
        <p className="text-sm text-zinc-500">4 ô thông tin (địa chỉ, điện thoại, email, giờ làm việc).</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({items?.length ?? 0})</h2>
          <Link
            href="/lien-he/thong-tin/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm thông tin
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/020_create_contact_info_cards.sql) trong Supabase SQL Editor.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                        {ICON_LABELS[item.icon_key] ?? item.icon_key}
                      </span>
                      <span className="truncate text-sm font-medium text-zinc-900">{item.label_vi}</span>
                    </div>
                    <div className="truncate text-xs text-zinc-400">{item.value_vi}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-zinc-400">#{item.sort_order}</span>
                    <Link
                      href={`/lien-he/thong-tin/${item.id}`}
                      className="text-sm text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteContactCardButton id={item.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
                Chưa có thông tin nào. Nhấn &quot;+ Thêm thông tin&quot; để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
