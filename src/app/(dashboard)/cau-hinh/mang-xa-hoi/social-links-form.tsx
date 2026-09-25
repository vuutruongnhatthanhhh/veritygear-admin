"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertSocialLinks } from "./actions";

type Links = {
  facebook_url: string;
  facebook_active: boolean;
  instagram_url: string;
  instagram_active: boolean;
  tiktok_url: string;
  tiktok_active: boolean;
  youtube_url: string;
  youtube_active: boolean;
} | null;

const PLATFORMS = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/veritygear" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/veritygear" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@veritygear" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@veritygear" },
] as const;

export function SocialLinksForm({ links }: { links: Links }) {
  const [error, action, pending] = useActionState(upsertSocialLinks, null);
  const [saved, setSaved] = useState(false);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !pending && !error) {
      setSaved(true);
    }
    prevPending.current = pending;
  }, [pending, error]);

  return (
    <form action={action} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message="Đã lưu thay đổi" onDone={() => setSaved(false)} />}

      {PLATFORMS.map((p) => (
        <div key={p.key} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700">{p.label}</label>
            <input
              name={`${p.key}_url`}
              defaultValue={links?.[`${p.key}_url` as keyof NonNullable<Links>] as string | undefined}
              placeholder={p.placeholder}
              className={inputCls}
            />
          </div>
          <label className="mb-2.5 flex shrink-0 items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name={`${p.key}_active`}
              defaultChecked={(links?.[`${p.key}_active` as keyof NonNullable<Links>] as boolean | undefined) ?? true}
              className="rounded border-zinc-300"
            />
            Hiện
          </label>
        </div>
      ))}

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
