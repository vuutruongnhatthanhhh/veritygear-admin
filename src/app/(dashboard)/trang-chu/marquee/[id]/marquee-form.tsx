"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertMarqueeItem } from "../actions";

type MarqueeItem = {
  id: number;
  sort_order: number;
  is_active: boolean;
  text_vi: string;
  text_en: string;
};

export function MarqueeForm({ item }: { item: MarqueeItem | null }) {
  const [error, action, pending] = useActionState(upsertMarqueeItem, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm dòng chữ");
      router.push("/trang-chu/marquee");
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
        <label className="mt-6 flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="rounded border-zinc-300" />
          Hiển thị dòng chữ này
        </label>
      </div>

      <BilingualPair
        label="Nội dung"
        nameVi="text_vi"
        nameEn="text_en"
        defaultVi={item?.text_vi}
        defaultEn={item?.text_en}
        required
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm dòng chữ"}
        </button>
        <Link href="/trang-chu/marquee" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
