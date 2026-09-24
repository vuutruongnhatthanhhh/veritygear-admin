import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteStoryBlockButton } from "./delete-story-block-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Câu chuyện - Giới thiệu" };

export default async function CauChuyenPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("about_story_blocks").select("*").order("sort_order");

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/gioi-thieu/banner" className="transition hover:text-zinc-700">
            Giới thiệu
          </Link>
          <span>/</span>
          <span>Câu chuyện</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Câu chuyện</h1>
        <p className="text-sm text-zinc-500">Các khối ảnh/chữ xen kẽ kể câu chuyện thương hiệu.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({items?.length ?? 0})</h2>
          <Link
            href="/gioi-thieu/cau-chuyen/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm câu chuyện
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/011_create_about_story_blocks.sql) trong Supabase SQL Editor.
          </p>
        ) : (
          <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
            {items && items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-zinc-900">{item.title_vi}</span>
                      {item.reverse && (
                        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                          Đảo chiều
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-zinc-400">{item.eyebrow_vi}</div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-zinc-400">#{item.sort_order}</span>
                    <Link
                      href={`/gioi-thieu/cau-chuyen/${item.id}`}
                      className="text-sm text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteStoryBlockButton id={item.id} imageUrl={item.image_url} />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white px-4 py-8 text-center text-sm text-zinc-500">
                Chưa có câu chuyện nào. Nhấn &quot;+ Thêm câu chuyện&quot; để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
