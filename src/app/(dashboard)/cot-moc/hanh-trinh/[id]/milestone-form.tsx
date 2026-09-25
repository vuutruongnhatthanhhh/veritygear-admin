"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertMilestone } from "../actions";

type Milestone = {
  id: number;
  sort_order: number;
  year: string;
  title_vi: string;
  title_en: string;
  desc_vi: string;
  desc_en: string;
};

export function MilestoneForm({ item }: { item: Milestone | null }) {
  const [error, action, pending] = useActionState(upsertMilestone, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm cột mốc");
      router.push("/cot-moc/hanh-trinh");
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
          <label className="mb-1 block text-sm font-medium text-zinc-700">Năm</label>
          <input name="year" defaultValue={item?.year ?? ""} required placeholder="2026" className={inputCls} />
        </div>
      </div>

      <BilingualPair label="Tiêu đề" nameVi="title_vi" nameEn="title_en" defaultVi={item?.title_vi} defaultEn={item?.title_en} required />
      <BilingualPair label="Nội dung" nameVi="desc_vi" nameEn="desc_en" defaultVi={item?.desc_vi} defaultEn={item?.desc_en} multiline />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm cột mốc"}
        </button>
        <Link href="/cot-moc/hanh-trinh" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
