"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertStoryBlock } from "../actions";

type StoryBlock = {
  id: number;
  sort_order: number;
  reverse: boolean;
  eyebrow_vi: string;
  eyebrow_en: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
  image_url: string | null;
};

export function StoryBlockForm({ item }: { item: StoryBlock | null }) {
  const [error, action, pending] = useActionState(upsertStoryBlock, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm câu chuyện");
      router.push("/gioi-thieu/cau-chuyen");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <ImageField label="Ảnh minh họa" initialUrl={item?.image_url ?? null} bucket="about-images" pickerTitle="Chọn ảnh câu chuyện" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Thứ tự hiển thị</label>
          <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={inputCls} />
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="reverse" defaultChecked={item?.reverse ?? false} className="rounded border-zinc-300" />
          Đảo chiều ảnh/chữ (ảnh sang phải)
        </label>
      </div>

      <BilingualPair label="Nhãn nhỏ (eyebrow)" nameVi="eyebrow_vi" nameEn="eyebrow_en" defaultVi={item?.eyebrow_vi} defaultEn={item?.eyebrow_en} />
      <BilingualPair label="Tiêu đề" nameVi="title_vi" nameEn="title_en" defaultVi={item?.title_vi} defaultEn={item?.title_en} required />
      <BilingualPair label="Nội dung" nameVi="desc_vi" nameEn="desc_en" defaultVi={item?.desc_vi} defaultEn={item?.desc_en} multiline />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm câu chuyện"}
        </button>
        <Link href="/gioi-thieu/cau-chuyen" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
