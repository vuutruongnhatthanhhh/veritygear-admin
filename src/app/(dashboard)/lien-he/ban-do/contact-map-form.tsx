"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { inputCls } from "@/components/cms-field";
import { Toast } from "@/components/toast";
import { upsertContactMap } from "./actions";

type Map = {
  heading_vi: string;
  heading_en: string;
  footer_label_vi: string;
  footer_label_en: string;
  map_embed_url: string;
} | null;

export function ContactMapForm({ map }: { map: Map }) {
  const [error, action, pending] = useActionState(upsertContactMap, null);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(map?.map_embed_url ?? "");
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

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Link nhúng Google Maps</label>
        <input
          name="map_embed_url"
          type="url"
          required
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder="https://www.google.com/maps?q=...&output=embed"
          className={inputCls}
        />
        <p className="mt-1.5 text-xs text-zinc-500">
          Vào Google Maps → tìm địa chỉ → <strong>Chia sẻ</strong> → <strong>Nhúng bản đồ</strong> → sao chép URL bên
          trong thuộc tính <code>src=&quot;...&quot;</code> của đoạn mã, dán vào đây.
        </p>
      </div>

      {preview && (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <div className="relative aspect-4/3 w-full bg-zinc-100">
            <iframe title="Xem trước bản đồ" src={preview} className="absolute inset-0 h-full w-full" loading="lazy" />
          </div>
        </div>
      )}

      <BilingualPair label="Tiêu đề" nameVi="heading_vi" nameEn="heading_en" defaultVi={map?.heading_vi} defaultEn={map?.heading_en} />
      <BilingualPair label="Chú thích dưới bản đồ" nameVi="footer_label_vi" nameEn="footer_label_en" defaultVi={map?.footer_label_vi} defaultEn={map?.footer_label_en} />

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
