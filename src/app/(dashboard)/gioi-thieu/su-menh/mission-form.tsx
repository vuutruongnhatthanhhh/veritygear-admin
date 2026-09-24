"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { BilingualPair } from "@/components/bilingual-pair";
import { Toast } from "@/components/toast";
import { upsertAboutMission } from "./actions";

type Mission = {
  eyebrow_vi: string;
  eyebrow_en: string;
  body_vi: string;
  body_en: string;
} | null;

export function MissionForm({ mission }: { mission: Mission }) {
  const [error, action, pending] = useActionState(upsertAboutMission, null);
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

      <BilingualPair label="Nhãn nhỏ (eyebrow)" nameVi="eyebrow_vi" nameEn="eyebrow_en" defaultVi={mission?.eyebrow_vi} defaultEn={mission?.eyebrow_en} />
      <BilingualPair label="Nội dung sứ mệnh" nameVi="body_vi" nameEn="body_en" defaultVi={mission?.body_vi} defaultEn={mission?.body_en} multiline />

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
