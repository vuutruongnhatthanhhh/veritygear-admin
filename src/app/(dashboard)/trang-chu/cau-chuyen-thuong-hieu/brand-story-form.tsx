"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { Field, inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertBrandStory } from "./actions";

type Story = {
  eyebrow_vi: string;
  eyebrow_en: string;
  heading_vi: string;
  heading_en: string;
  body_vi: string;
  body_en: string;
  cta_label_vi: string;
  cta_label_en: string;
  cta_url: string;
  image_url: string | null;
} | null;

export function BrandStoryForm({ story }: { story: Story }) {
  const [error, action, pending] = useActionState(upsertBrandStory, null);
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

      <ImageField
        label="Ảnh minh họa"
        initialUrl={story?.image_url ?? null}
        bucket="home-images"
        pickerTitle="Chọn ảnh câu chuyện thương hiệu"
      />

      <BilingualPair label="Nhãn nhỏ (eyebrow)" nameVi="eyebrow_vi" nameEn="eyebrow_en" defaultVi={story?.eyebrow_vi} defaultEn={story?.eyebrow_en} />
      <BilingualPair label="Tiêu đề" nameVi="heading_vi" nameEn="heading_en" defaultVi={story?.heading_vi} defaultEn={story?.heading_en} />
      <BilingualPair label="Nội dung" nameVi="body_vi" nameEn="body_en" defaultVi={story?.body_vi} defaultEn={story?.body_en} multiline />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BilingualPair label="Nhãn nút" nameVi="cta_label_vi" nameEn="cta_label_en" defaultVi={story?.cta_label_vi} defaultEn={story?.cta_label_en} />
        <Field label="Liên kết">
          <input name="cta_url" defaultValue={story?.cta_url ?? "/gioi-thieu"} className={inputCls} />
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
