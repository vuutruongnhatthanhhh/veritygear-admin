"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { Field, inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertProduct } from "../actions";
import { SpecsEditor } from "./specs-editor";

type Product = {
  id: number;
  slug: string;
  name: string;
  category_id: number | null;
  tagline_vi: string;
  tagline_en: string;
  description_vi: string;
  description_en: string;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  badge_vi: string | null;
  badge_en: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_spotlight: boolean;
  is_lineup: boolean;
  sort_order: number;
};

type Spec = { label_vi: string; label_en: string; value_vi: string; value_en: string };
type Category = { id: number; name_vi: string };

export function ProductForm({
  item,
  specs,
  categories,
}: {
  item: Product | null;
  specs: Spec[];
  categories: Category[];
}) {
  const [error, action, pending] = useActionState(upsertProduct, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm sản phẩm");
      router.push("/san-pham");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <ImageField label="Ảnh sản phẩm" initialUrl={item?.image_url ?? null} bucket="product-images" pickerTitle="Chọn ảnh sản phẩm" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Tên sản phẩm">
          <input name="name" defaultValue={item?.name ?? ""} required placeholder="VERTEX X1" className={inputCls} />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={item?.slug ?? ""} required placeholder="vertex-x1" className={inputCls} />
        </Field>
      </div>

      <Field label="Danh mục">
        <select name="category_id" defaultValue={item?.category_id ?? ""} className={inputCls}>
          <option value="">— Chưa phân loại —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_vi}
            </option>
          ))}
        </select>
      </Field>

      <BilingualPair label="Tagline" nameVi="tagline_vi" nameEn="tagline_en" defaultVi={item?.tagline_vi} defaultEn={item?.tagline_en} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Giá (₫)">
          <input name="price" type="number" min={0} defaultValue={item?.price ?? 0} required className={inputCls} />
        </Field>
        <Field label="Giá so sánh (₫, tùy chọn)">
          <input name="compare_at_price" type="number" min={0} defaultValue={item?.compare_at_price ?? ""} className={inputCls} />
        </Field>
      </div>

      <BilingualPair
        label="Nhãn (tùy chọn — vd: Bán chạy / Mới / Giảm giá)"
        nameVi="badge_vi"
        nameEn="badge_en"
        defaultVi={item?.badge_vi ?? ""}
        defaultEn={item?.badge_en ?? ""}
      />

      <BilingualPair label="Mô tả" nameVi="description_vi" nameEn="description_en" defaultVi={item?.description_vi} defaultEn={item?.description_en} multiline />

      <SpecsEditor initialSpecs={specs} />

      <div className="grid grid-cols-1 gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="rounded border-zinc-300" />
          Đang bán (hiển thị trên shop)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="is_featured" defaultChecked={item?.is_featured ?? false} className="rounded border-zinc-300" />
          Nổi bật trên trang chủ
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="is_spotlight" defaultChecked={item?.is_spotlight ?? false} className="rounded border-zinc-300" />
          Sản phẩm chủ lực (Hero trang chủ)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="is_lineup" defaultChecked={item?.is_lineup ?? false} className="rounded border-zinc-300" />
          Lineup mới (trang Cột mốc)
        </label>
      </div>

      <Field label="Thứ tự hiển thị">
        <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={`${inputCls} max-w-40`} />
      </Field>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </button>
        <Link href="/san-pham" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
