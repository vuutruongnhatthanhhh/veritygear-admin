import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteGalleryImageButton } from "./delete-gallery-image-button";
import { ToastFromSession } from "@/components/toast";

export const metadata = { title: "Thư viện ảnh - Giới thiệu" };

export default async function ThuVienAnhPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("about_gallery_images").select("*").order("sort_order");

  return (
    <div className="max-w-3xl space-y-10">
      <ToastFromSession />
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/gioi-thieu/banner" className="transition hover:text-zinc-700">
            Giới thiệu
          </Link>
          <span>/</span>
          <span>Thư viện ảnh</span>
        </div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Thư viện ảnh</h1>
        <p className="text-sm text-zinc-500">Dải ảnh cuối trang giới thiệu.</p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Nội dung ({items?.length ?? 0})</h2>
          <Link
            href="/gioi-thieu/thu-vien-anh/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Thêm ảnh
          </Link>
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            Không thể tải dữ liệu. Hãy chắc chắn đã chạy migration SQL
            (migrations/015_create_about_gallery_images.sql) trong Supabase SQL Editor.
          </p>
        ) : items && items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                <div className="relative aspect-square bg-zinc-100">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.alt_vi} fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="text-xs text-zinc-400">#{item.sort_order}</span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/gioi-thieu/thu-vien-anh/${item.id}`}
                      className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900"
                    >
                      Sửa
                    </Link>
                    <DeleteGalleryImageButton id={item.id} imageUrl={item.image_url} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
            Chưa có ảnh nào. Nhấn &quot;+ Thêm ảnh&quot; để bắt đầu.
          </div>
        )}
      </div>
    </div>
  );
}
