"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { ImageField } from "@/components/image-field";
import { Field, inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertSeoSettings } from "./actions";

type Seo = {
  site_name: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  keywords_vi: string;
  keywords_en: string;
  og_image_url: string | null;
} | null;

export function SeoForm({ content }: { content: Seo }) {
  const [error, action, pending] = useActionState(upsertSeoSettings, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) setSaved(true);
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      <Field label="Tên thương hiệu (Site name)">
        <input name="site_name" defaultValue={content?.site_name ?? "VERITY GEAR"} required className={inputCls} />
      </Field>
      <p className="-mt-4 text-xs text-zinc-400">
        Dùng cho hậu tố tiêu đề: &quot;Tên trang — {content?.site_name ?? "VERITY GEAR"}&quot;.
      </p>

      <BilingualPair
        label="Tiêu đề trang chủ (Title)"
        nameVi="title_vi"
        nameEn="title_en"
        defaultVi={content?.title_vi}
        defaultEn={content?.title_en}
      />

      <BilingualPair
        label="Mô tả mặc định (Meta description)"
        nameVi="description_vi"
        nameEn="description_en"
        defaultVi={content?.description_vi}
        defaultEn={content?.description_en}
        multiline
      />
      <p className="-mt-4 text-xs text-zinc-400">Nên khoảng 150–160 ký tự để hiển thị đầy đủ trên Google.</p>

      <BilingualPair
        label="Từ khóa (Keywords, cách nhau bằng dấu phẩy)"
        nameVi="keywords_vi"
        nameEn="keywords_en"
        defaultVi={content?.keywords_vi}
        defaultEn={content?.keywords_en}
        multiline
      />

      <ImageField
        label="Ảnh chia sẻ mặc định (Open Graph — hiện khi chia sẻ link lên Facebook/Zalo...)"
        initialUrl={content?.og_image_url ?? null}
        bucket="home-images"
        pickerTitle="Chọn ảnh chia sẻ mặc định"
      />
      <p className="-mt-2 text-xs text-zinc-400">Khuyến nghị tỉ lệ 1200×630px.</p>

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
