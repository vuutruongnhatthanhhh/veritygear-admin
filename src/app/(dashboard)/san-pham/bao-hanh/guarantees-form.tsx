"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { Toast } from "@/components/toast";
import { upsertProductGuarantees } from "./actions";

type Guarantees = {
  warranty_label_vi: string;
  warranty_label_en: string;
  warranty_desc_vi: string;
  warranty_desc_en: string;
  return_label_vi: string;
  return_label_en: string;
  return_desc_vi: string;
  return_desc_en: string;
  shipping_label_vi: string;
  shipping_label_en: string;
  shipping_desc_vi: string;
  shipping_desc_en: string;
} | null;

export function GuaranteesForm({ guarantees }: { guarantees: Guarantees }) {
  const [error, action, pending] = useActionState(upsertProductGuarantees, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) setSaved(true);
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-900">Bảo hành</h2>
        <BilingualPair label="Tiêu đề" nameVi="warranty_label_vi" nameEn="warranty_label_en" defaultVi={guarantees?.warranty_label_vi} defaultEn={guarantees?.warranty_label_en} />
        <BilingualPair label="Mô tả" nameVi="warranty_desc_vi" nameEn="warranty_desc_en" defaultVi={guarantees?.warranty_desc_vi} defaultEn={guarantees?.warranty_desc_en} />
      </div>

      <div className="space-y-4 border-t border-zinc-200 pt-6">
        <h2 className="text-sm font-semibold text-zinc-900">Đổi trả</h2>
        <BilingualPair label="Tiêu đề" nameVi="return_label_vi" nameEn="return_label_en" defaultVi={guarantees?.return_label_vi} defaultEn={guarantees?.return_label_en} />
        <BilingualPair label="Mô tả" nameVi="return_desc_vi" nameEn="return_desc_en" defaultVi={guarantees?.return_desc_vi} defaultEn={guarantees?.return_desc_en} />
      </div>

      <div className="space-y-4 border-t border-zinc-200 pt-6">
        <h2 className="text-sm font-semibold text-zinc-900">Giao hàng</h2>
        <BilingualPair label="Tiêu đề" nameVi="shipping_label_vi" nameEn="shipping_label_en" defaultVi={guarantees?.shipping_label_vi} defaultEn={guarantees?.shipping_label_en} />
        <BilingualPair label="Mô tả" nameVi="shipping_desc_vi" nameEn="shipping_desc_en" defaultVi={guarantees?.shipping_desc_vi} defaultEn={guarantees?.shipping_desc_en} />
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
