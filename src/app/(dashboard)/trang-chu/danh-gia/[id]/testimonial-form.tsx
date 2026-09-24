"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertTestimonial } from "../actions";

type Testimonial = {
  id: number;
  sort_order: number;
  is_active: boolean;
  quote_vi: string;
  quote_en: string;
  name: string;
  role_vi: string;
  role_en: string;
  rating: number;
};

export function TestimonialForm({ item }: { item: Testimonial | null }) {
  const [error, action, pending] = useActionState(upsertTestimonial, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm đánh giá");
      router.push("/trang-chu/danh-gia");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Thứ tự hiển thị</label>
          <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Số sao</label>
          <select name="rating" defaultValue={item?.rating ?? 5} className={inputCls}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} sao
              </option>
            ))}
          </select>
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="rounded border-zinc-300" />
          Hiển thị đánh giá này
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Tên người đánh giá</label>
        <input name="name" defaultValue={item?.name ?? ""} required className={inputCls} placeholder="Minh Quân" />
      </div>

      <BilingualPair label="Vai trò / mô tả ngắn" nameVi="role_vi" nameEn="role_en" defaultVi={item?.role_vi} defaultEn={item?.role_en} />
      <BilingualPair label="Nội dung đánh giá" nameVi="quote_vi" nameEn="quote_en" defaultVi={item?.quote_vi} defaultEn={item?.quote_en} multiline required />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm đánh giá"}
        </button>
        <Link href="/trang-chu/danh-gia" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
