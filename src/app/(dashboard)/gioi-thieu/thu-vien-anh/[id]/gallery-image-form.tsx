"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertGalleryImage } from "../actions";

type GalleryImage = {
  id: number;
  sort_order: number;
  image_url: string;
  alt_vi: string;
  alt_en: string;
};

export function GalleryImageForm({ item }: { item: GalleryImage | null }) {
  const [error, action, pending] = useActionState(upsertGalleryImage, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm ảnh");
      router.push("/gioi-thieu/thu-vien-anh");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <ImageField label="Ảnh" initialUrl={item?.image_url ?? null} bucket="about-images" pickerTitle="Chọn ảnh thư viện" />

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Thứ tự hiển thị</label>
        <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={inputCls} />
      </div>

      <BilingualPair label="Mô tả ảnh (alt text)" nameVi="alt_vi" nameEn="alt_en" defaultVi={item?.alt_vi} defaultEn={item?.alt_en} required />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm ảnh"}
        </button>
        <Link href="/gioi-thieu/thu-vien-anh" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
