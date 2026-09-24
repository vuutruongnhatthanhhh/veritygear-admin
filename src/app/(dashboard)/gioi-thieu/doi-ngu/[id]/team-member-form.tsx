"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertTeamMember } from "../actions";

type TeamMember = {
  id: number;
  sort_order: number;
  name: string;
  role_vi: string;
  role_en: string;
  image_url: string | null;
};

export function TeamMemberForm({ item }: { item: TeamMember | null }) {
  const [error, action, pending] = useActionState(upsertTeamMember, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm thành viên");
      router.push("/gioi-thieu/doi-ngu");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <ImageField label="Ảnh chân dung" initialUrl={item?.image_url ?? null} bucket="about-images" pickerTitle="Chọn ảnh thành viên" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Thứ tự hiển thị</label>
          <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Họ tên</label>
          <input name="name" defaultValue={item?.name ?? ""} required placeholder="Nguyễn Văn A" className={inputCls} />
        </div>
      </div>

      <BilingualPair label="Vai trò" nameVi="role_vi" nameEn="role_en" defaultVi={item?.role_vi} defaultEn={item?.role_en} required />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm thành viên"}
        </button>
        <Link href="/gioi-thieu/doi-ngu" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
