"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { Toast } from "@/components/toast";
import { upsertMilestonesHero } from "./actions";

type Hero = {
  eyebrow_vi: string;
  eyebrow_en: string;
  heading_line1_vi: string;
  heading_line2_vi: string;
  heading_line1_en: string;
  heading_line2_en: string;
  image_url: string | null;
} | null;

export function MilestonesHeroForm({ hero }: { hero: Hero }) {
  const [error, action, pending] = useActionState(upsertMilestonesHero, null);
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

      <ImageField label="Ảnh nền banner" initialUrl={hero?.image_url ?? null} bucket="milestones-images" pickerTitle="Chọn ảnh banner cột mốc" />

      <BilingualPair label="Nhãn nhỏ (eyebrow)" nameVi="eyebrow_vi" nameEn="eyebrow_en" defaultVi={hero?.eyebrow_vi} defaultEn={hero?.eyebrow_en} />
      <BilingualPair label="Tiêu đề dòng 1" nameVi="heading_line1_vi" nameEn="heading_line1_en" defaultVi={hero?.heading_line1_vi} defaultEn={hero?.heading_line1_en} />
      <BilingualPair label="Tiêu đề dòng 2" nameVi="heading_line2_vi" nameEn="heading_line2_en" defaultVi={hero?.heading_line2_vi} defaultEn={hero?.heading_line2_en} />

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
