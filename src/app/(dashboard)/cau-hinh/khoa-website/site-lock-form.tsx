"use client";

import { useState, useTransition } from "react";
import { Toast } from "@/components/toast";
import { setSiteLock, regenerateBypassCode } from "./actions";

type Lock = { is_locked: boolean; bypass_code: string } | null;

export function SiteLockForm({ lock, siteUrl }: { lock: Lock; siteUrl: string }) {
  const [isLocked, setIsLocked] = useState(lock?.is_locked ?? false);
  const [bypassCode, setBypassCode] = useState(lock?.bypass_code ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const bypassLink = bypassCode ? `${siteUrl}/?vg_key=${bypassCode}` : "";

  function handleToggle(next: boolean) {
    setError(null);
    startTransition(async () => {
      const { bypassCode: newCode, error: err } = await setSiteLock(next);
      if (err) {
        setError(err);
        return;
      }
      setIsLocked(next);
      if (newCode) setBypassCode(newCode);
      setSaved(next ? "Đã khóa website" : "Đã mở lại website");
    });
  }

  function handleRegenerate() {
    if (!confirm("Tạo mã mới sẽ làm link cũ (nếu đã chia sẻ) ngừng hoạt động. Tiếp tục?")) return;
    setError(null);
    startTransition(async () => {
      const { bypassCode: newCode, error: err } = await regenerateBypassCode();
      if (err || !newCode) {
        setError(err ?? "Không thể tạo mã mới");
        return;
      }
      setBypassCode(newCode);
      setSaved("Đã tạo mã truy cập mới — hãy lưu lại link mới bên dưới.");
    });
  }

  async function handleCopy() {
    if (!bypassLink) return;
    await navigator.clipboard.writeText(bypassLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && <Toast message={saved} onDone={() => setSaved(null)} />}

      <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <div>
          <p className="text-sm font-medium text-zinc-900">
            {isLocked ? "Website đang bị khóa" : "Website đang mở bình thường"}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">
            {isLocked ? "Khách truy cập thấy trang “Sắp quay trở lại”." : "Khách truy cập thấy nội dung bình thường."}
          </p>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleToggle(!isLocked)}
          className={`flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            isLocked ? "bg-red-600" : "bg-zinc-300"
          }`}
          aria-label={isLocked ? "Mở khóa website" : "Khóa website"}
        >
          <span
            className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
              isLocked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700">Link truy cập riêng (bỏ qua khóa)</label>
        {bypassLink ? (
          <div className="flex items-center gap-2">
            <input readOnly value={bypassLink} className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-600" />
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              {copied ? "Đã chép" : "Chép"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">Chưa có mã — bật khóa website hoặc tạo mã mới để có link.</p>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={handleRegenerate}
          className="text-xs font-medium text-zinc-500 transition hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Tạo mã mới (vô hiệu hóa link cũ)
        </button>
        {!siteUrl && (
          <p className="text-xs text-amber-600">
            Thiếu biến môi trường CLIENT_SITE_URL nên chưa ghép được link đầy đủ — mã truy cập vẫn đúng, chỉ cần tự ghép: {"<domain>"}/?vg_key={bypassCode || "<mã>"}
          </p>
        )}
      </div>
    </div>
  );
}
