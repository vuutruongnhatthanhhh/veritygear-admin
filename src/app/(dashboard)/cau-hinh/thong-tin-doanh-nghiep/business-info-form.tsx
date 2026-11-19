"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Toast } from "@/components/toast";
import { upsertBusinessInfo } from "./actions";

type Content = { content_vi: string; content_en: string } | null;

export function BusinessInfoForm({ content }: { content: Content }) {
  const [error, action, pending] = useActionState(upsertBusinessInfo, null);
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

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Nội dung (VI)</label>
        <RichTextEditor name="content_vi" defaultValue={content?.content_vi ?? ""} bucket="custom-pages-images" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Nội dung (EN)</label>
        <RichTextEditor name="content_en" defaultValue={content?.content_en ?? ""} bucket="custom-pages-images" />
      </div>

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
