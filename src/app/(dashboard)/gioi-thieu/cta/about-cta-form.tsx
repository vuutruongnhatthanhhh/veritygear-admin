"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { Field, inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertAboutCta } from "./actions";

type Cta = {
  heading_line1_vi: string;
  heading_line2_vi: string;
  heading_line1_en: string;
  heading_line2_en: string;
  body_vi: string;
  body_en: string;
  cta_label_vi: string;
  cta_label_en: string;
  cta_url: string;
} | null;

export function AboutCtaForm({ cta }: { cta: Cta }) {
  const [error, action, pending] = useActionState(upsertAboutCta, null);
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

      <BilingualPair label="Tiêu đề dòng 1" nameVi="heading_line1_vi" nameEn="heading_line1_en" defaultVi={cta?.heading_line1_vi} defaultEn={cta?.heading_line1_en} />
      <BilingualPair label="Tiêu đề dòng 2" nameVi="heading_line2_vi" nameEn="heading_line2_en" defaultVi={cta?.heading_line2_vi} defaultEn={cta?.heading_line2_en} />
      <BilingualPair label="Nội dung" nameVi="body_vi" nameEn="body_en" defaultVi={cta?.body_vi} defaultEn={cta?.body_en} multiline />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BilingualPair label="Nhãn nút" nameVi="cta_label_vi" nameEn="cta_label_en" defaultVi={cta?.cta_label_vi} defaultEn={cta?.cta_label_en} />
        <Field label="Liên kết">
          <input name="cta_url" defaultValue={cta?.cta_url ?? "/san-pham"} className={inputCls} />
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
