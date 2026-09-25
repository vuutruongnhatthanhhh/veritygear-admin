"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { Toast } from "@/components/toast";
import { upsertFooter } from "./actions";

type Footer = {
  tagline_vi: string;
  tagline_en: string;
} | null;

export function FooterForm({ content }: { content: Footer }) {
  const [error, action, pending] = useActionState(upsertFooter, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) setSaved(true);
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <BilingualPair
        label="Câu giới thiệu (dưới logo)"
        nameVi="tagline_vi"
        nameEn="tagline_en"
        defaultVi={content?.tagline_vi}
        defaultEn={content?.tagline_en}
        multiline
      />

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
