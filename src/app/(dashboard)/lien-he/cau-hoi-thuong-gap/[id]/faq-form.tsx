"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertFaq } from "../actions";

type Faq = {
  id: number;
  sort_order: number;
  question_vi: string;
  question_en: string;
  answer_vi: string;
  answer_en: string;
};

export function FaqForm({ item }: { item: Faq | null }) {
  const [error, action, pending] = useActionState(upsertFaq, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm câu hỏi");
      router.push("/lien-he/cau-hoi-thuong-gap");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Thứ tự hiển thị</label>
        <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={inputCls} />
      </div>

      <BilingualPair label="Câu hỏi" nameVi="question_vi" nameEn="question_en" defaultVi={item?.question_vi} defaultEn={item?.question_en} required />
      <BilingualPair label="Câu trả lời" nameVi="answer_vi" nameEn="answer_en" defaultVi={item?.answer_vi} defaultEn={item?.answer_en} multiline required />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm câu hỏi"}
        </button>
        <Link href="/lien-he/cau-hoi-thuong-gap" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
