"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertValueItem } from "../actions";

type ValueItem = {
  id: number;
  sort_order: number;
  icon_key: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

const ICON_OPTIONS = [
  { value: "precision", label: "Chính xác" },
  { value: "noCompromise", label: "Không khoan nhượng" },
  { value: "durability", label: "Bền vững" },
  { value: "community", label: "Cộng đồng" },
];

export function ValueForm({ item }: { item: ValueItem | null }) {
  const [error, action, pending] = useActionState(upsertValueItem, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm giá trị");
      router.push("/gioi-thieu/gia-tri-cot-loi");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Thứ tự hiển thị</label>
          <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Biểu tượng</label>
          <select name="icon_key" defaultValue={item?.icon_key ?? "precision"} className={inputCls}>
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BilingualPair label="Tiêu đề" nameVi="title_vi" nameEn="title_en" defaultVi={item?.title_vi} defaultEn={item?.title_en} required />
      <BilingualPair label="Mô tả" nameVi="desc_vi" nameEn="desc_en" defaultVi={item?.desc_vi} defaultEn={item?.desc_en} multiline />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm giá trị"}
        </button>
        <Link href="/gioi-thieu/gia-tri-cot-loi" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
