"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertCategory } from "../actions";

type Category = {
  id: number;
  slug: string;
  name_vi: string;
  name_en: string;
  image_url: string | null;
  sort_order: number;
  show_on_homepage: boolean;
};

export function CategoryForm({ item }: { item: Category | null }) {
  const [error, action, pending] = useActionState(upsertCategory, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm danh mục");
      router.push("/san-pham/danh-muc");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <ImageField label="Ảnh danh mục" initialUrl={item?.image_url ?? null} bucket="product-images" pickerTitle="Chọn ảnh danh mục" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Slug</label>
          <input name="slug" defaultValue={item?.slug ?? ""} required placeholder="ban-phim" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Thứ tự hiển thị</label>
          <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={inputCls} />
        </div>
      </div>

      <BilingualPair label="Tên danh mục" nameVi="name_vi" nameEn="name_en" defaultVi={item?.name_vi} defaultEn={item?.name_en} required />

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="show_on_homepage"
          defaultChecked={item?.show_on_homepage ?? true}
          className="rounded border-zinc-300"
        />
        Hiển thị ở trang chủ (khối danh mục)
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm danh mục"}
        </button>
        <Link href="/san-pham/danh-muc" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
