"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { RichTextEditor } from "@/components/rich-text-editor";
import { DateField } from "@/components/date-field";
import { Field, inputCls } from "@/components/cms-field";
import { announceToast } from "@/components/toast";
import { upsertNewsArticle } from "../actions";

type Article = {
  id: number;
  slug: string;
  category_id: number | null;
  title_vi: string;
  title_en: string;
  excerpt_vi: string;
  excerpt_en: string;
  content_vi: string;
  content_en: string;
  image_url: string | null;
  published_at: string;
  read_minutes: number;
  is_active: boolean;
};

type Category = { id: number; name_vi: string };

export function ArticleForm({ item, categories }: { item: Article | null; categories: Category[] }) {
  const [error, action, pending] = useActionState(upsertNewsArticle, null);
  const prevPending = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      announceToast(item ? "Đã lưu thay đổi" : "Đã thêm bài viết");
      router.push("/tin-tuc");
    }
    prevPending.current = pending;
  }, [pending, error, router, item]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <input type="hidden" name="id" value={item?.id ?? ""} />

      <ImageField label="Ảnh bìa" initialUrl={item?.image_url ?? null} bucket="news-images" pickerTitle="Chọn ảnh bìa bài viết" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Slug">
          <input name="slug" defaultValue={item?.slug ?? ""} required placeholder="ten-bai-viet" className={inputCls} />
        </Field>
        <Field label="Danh mục">
          <select name="category_id" defaultValue={item?.category_id ?? ""} className={inputCls}>
            <option value="">— Chưa phân loại —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_vi}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <BilingualPair label="Tiêu đề" nameVi="title_vi" nameEn="title_en" defaultVi={item?.title_vi} defaultEn={item?.title_en} required />
      <BilingualPair label="Mô tả ngắn (excerpt)" nameVi="excerpt_vi" nameEn="excerpt_en" defaultVi={item?.excerpt_vi} defaultEn={item?.excerpt_en} multiline />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ngày đăng">
          <DateField name="published_at" defaultValue={item?.published_at ?? new Date().toISOString().slice(0, 10)} />
        </Field>
        <Field label="Thời gian đọc (phút)">
          <input name="read_minutes" type="number" min={1} defaultValue={item?.read_minutes ?? 5} required className={inputCls} />
        </Field>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Nội dung (VI)</label>
        <RichTextEditor name="content_vi" defaultValue={item?.content_vi ?? ""} bucket="news-images" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Nội dung (EN)</label>
        <RichTextEditor name="content_en" defaultValue={item?.content_en ?? ""} bucket="news-images" />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="rounded border-zinc-300" />
        Hiển thị trên trang Tin tức
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm bài viết"}
        </button>
        <Link href="/tin-tuc" className="text-sm text-zinc-500 transition hover:text-zinc-900">
          Hủy
        </Link>
      </div>
    </form>
  );
}
