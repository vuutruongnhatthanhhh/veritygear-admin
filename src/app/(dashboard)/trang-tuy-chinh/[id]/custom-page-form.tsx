"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Field, inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertCustomPage } from "../actions";

type CustomPage = {
  id: number;
  slug: string;
  title_vi: string;
  title_en: string;
  content_vi: string;
  content_en: string;
  sort_order: number;
  is_active: boolean;
};

export function CustomPageForm({ item }: { item: CustomPage | null }) {
  const [error, action, pending] = useActionState(upsertCustomPage, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm trang");
      router.push("/trang-tuy-chinh");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <Field label="Slug (đường dẫn: veritygear.vercel.app/slug)">
        <input name="slug" defaultValue={item?.slug ?? ""} required placeholder="chinh-sach-bao-mat" className={inputCls} />
      </Field>
      <p className="-mt-4 text-xs text-zinc-400">
        Tránh dùng trùng với các đường dẫn có sẵn của site: san-pham, tin-tuc, gio-hang, gioi-thieu, cot-moc, lien-he,
        tai-khoan, thanh-toan, dang-nhap, dang-ky, quen-mat-khau, dat-lai-mat-khau.
      </p>

      <BilingualPair label="Tiêu đề" nameVi="title_vi" nameEn="title_en" defaultVi={item?.title_vi} defaultEn={item?.title_en} required />

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Nội dung (VI)</label>
        <RichTextEditor name="content_vi" defaultValue={item?.content_vi ?? ""} bucket="custom-pages-images" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Nội dung (EN)</label>
        <RichTextEditor name="content_en" defaultValue={item?.content_en ?? ""} bucket="custom-pages-images" />
      </div>

      <Field label="Thứ tự hiển thị (trong footer)">
        <input name="sort_order" type="number" min={0} defaultValue={item?.sort_order ?? 0} required className={`${inputCls} max-w-40`} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="rounded border-zinc-300" />
        Hiển thị trang này (link ở footer + truy cập được)
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm trang"}
        </button>
        <Link href="/trang-tuy-chinh" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
