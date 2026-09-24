"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { Field, inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertHero } from "./actions";

type Hero = {
  eyebrow_vi: string;
  eyebrow_en: string;
  heading_line1_vi: string;
  heading_line2_vi: string;
  heading_line1_en: string;
  heading_line2_en: string;
  body_vi: string;
  body_en: string;
  cta1_label_vi: string;
  cta1_label_en: string;
  cta1_url: string;
  cta2_label_vi: string;
  cta2_label_en: string;
  cta2_url: string;
  image_url: string | null;
} | null;

export function HeroForm({ hero }: { hero: Hero }) {
  const [error, action, pending] = useActionState(upsertHero, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      setSaved(true);
    }
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <ImageField label="Ảnh nền hero" initialUrl={hero?.image_url ?? null} bucket="home-images" pickerTitle="Chọn ảnh hero" />

      <BilingualPair label="Nhãn nhỏ (eyebrow)" nameVi="eyebrow_vi" nameEn="eyebrow_en" defaultVi={hero?.eyebrow_vi} defaultEn={hero?.eyebrow_en} />
      <BilingualPair label="Tiêu đề dòng 1" nameVi="heading_line1_vi" nameEn="heading_line1_en" defaultVi={hero?.heading_line1_vi} defaultEn={hero?.heading_line1_en} />
      <BilingualPair label="Tiêu đề dòng 2" nameVi="heading_line2_vi" nameEn="heading_line2_en" defaultVi={hero?.heading_line2_vi} defaultEn={hero?.heading_line2_en} />
      <BilingualPair label="Mô tả" nameVi="body_vi" nameEn="body_en" defaultVi={hero?.body_vi} defaultEn={hero?.body_en} multiline />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BilingualPair label="Nút 1 - Nhãn" nameVi="cta1_label_vi" nameEn="cta1_label_en" defaultVi={hero?.cta1_label_vi} defaultEn={hero?.cta1_label_en} />
        <Field label="Nút 1 - Liên kết">
          <input name="cta1_url" defaultValue={hero?.cta1_url ?? "#"} className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BilingualPair label="Nút 2 - Nhãn" nameVi="cta2_label_vi" nameEn="cta2_label_en" defaultVi={hero?.cta2_label_vi} defaultEn={hero?.cta2_label_en} />
        <Field label="Nút 2 - Liên kết">
          <input name="cta2_url" defaultValue={hero?.cta2_url ?? "#"} className={inputCls} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
