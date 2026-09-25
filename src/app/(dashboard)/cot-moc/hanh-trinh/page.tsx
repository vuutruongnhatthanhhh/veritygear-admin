import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteMilestoneButton } from "./delete-milestone-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Hành trình - Cột mốc" };

export default async function HanhTrinhPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("milestones_timeline").select("*").order("sort_order");

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/cot-moc/banner" className="transition hover:text-zinc-700">
            Cột mốc
          </Link>
          <span>/</span>
          <span>Hành trình</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Hành trình</h1>
        <p className="text-sm text-zinc-500">Các mốc thời gian hiển thị trên trang cột mốc.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({items?.length ?? 0})</h2>
          <Link
            href="/cot-moc/hanh-trinh/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm cột mốc
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/018_create_milestones_timeline.sql) trong Supabase SQL Editor.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-semibold text-zinc-600">
                        {item.year}
                      </span>
                      <span className="truncate text-sm font-medium text-zinc-900">{item.title_vi}</span>
                    </div>
                    <div className="truncate text-xs text-zinc-400">{item.desc_vi}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-zinc-400">#{item.sort_order}</span>
                    <Link
                      href={`/cot-moc/hanh-trinh/${item.id}`}
                      className="text-sm text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteMilestoneButton id={item.id} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
                Chưa có cột mốc nào. Nhấn &quot;+ Thêm cột mốc&quot; để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
