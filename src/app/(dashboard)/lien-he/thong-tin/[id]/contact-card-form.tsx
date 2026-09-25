"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertContactCard } from "../actions";

type ContactCard = {
  id: number;
  sort_order: number;
  icon_key: string;
  label_vi: string;
  label_en: string;
  value_vi: string;
  value_en: string;
  href: string | null;
};

const ICON_OPTIONS = [
  { value: "location", label: "Địa chỉ" },
  { value: "phone", label: "Điện thoại" },
  { value: "email", label: "Email" },
  { value: "hours", label: "Giờ làm việc" },
];

export function ContactCardForm({ item }: { item: ContactCard | null }) {
  const [error, action, pending] = useActionState(upsertContactCard, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm thông tin");
      router.push("/lien-he/thong-tin");
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
          <select name="icon_key" defaultValue={item?.icon_key ?? "location"} className={inputCls}>
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <BilingualPair label="Nhãn" nameVi="label_vi" nameEn="label_en" defaultVi={item?.label_vi} defaultEn={item?.label_en} required />
      <BilingualPair label="Giá trị" nameVi="value_vi" nameEn="value_en" defaultVi={item?.value_vi} defaultEn={item?.value_en} multiline required />

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Liên kết (tùy chọn — <code>tel:...</code> hoặc <code>mailto:...</code>)
        </label>
        <input name="href" defaultValue={item?.href ?? ""} placeholder="tel:+842873001234" className={inputCls} />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm thông tin"}
        </button>
        <Link href="/lien-he/thong-tin" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
