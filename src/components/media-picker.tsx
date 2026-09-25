"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type BucketOption = { id: string; name: string };

// Labels shown to the user — kept identical to each section's label in the admin sidebar nav.
const BUCKET_LABELS: Record<string, string> = {
  "home-images": "Trang chủ",
  "about-images": "Giới thiệu",
  "milestones-images": "Cột mốc",
  "contact-images": "Liên hệ",
  "product-images": "Sản phẩm",
  "news-images": "Tin tức",
};
const labelFor = (b: BucketOption) => BUCKET_LABELS[b.id] ?? b.name;

type MediaFile = { name: string; url: string; bucket: string };

function BucketSwitcher({
  buckets,
  activeBucket,
  onChange,
}: {
  buckets: BucketOption[];
  activeBucket: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="mb-3 flex items-center gap-2">
      <span className="shrink-0 text-xs text-zinc-400">Thư mục:</span>
      <select
        value={activeBucket}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 transition focus:ring-2 focus:ring-zinc-900 focus:outline-none"
      >
        {buckets.map((b) => (
          <option key={b.id} value={b.id}>
            {labelFor(b)}
          </option>
        ))}
      </select>
    </label>
  );
}

type Props = {
  bucket: string;
  onSelect: (url: string) => void;
  onClose: () => void;
  title?: string;
  uploadLabel?: string;
};

export function MediaPicker({
  bucket,
  onSelect,
  onClose,
  title = "Chọn hình ảnh",
  uploadLabel = "Tải lên & chọn",
}: Props) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [buckets, setBuckets] = useState<BucketOption[]>([{ id: bucket, name: bucket }]);
  const [activeBucket, setActiveBucket] = useState(bucket);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loadOffset, setLoadOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/media/buckets")
      .then((res) => res.json())
      .then((data) => {
        if (data.buckets?.length) setBuckets(data.buckets);
      })
      .catch(() => {});
  }, []);

  const switchBucket = (id: string) => setActiveBucket(id);

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/media/list?offset=0`);
    const data = await res.json();
    setFiles(data.files ?? []);
    setHasMore(data.hasMore ?? false);
    setLoadOffset(data.files?.length ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tab === "library") loadLibrary();
  }, [tab, loadLibrary]);

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Xóa ảnh "${file.name}" khỏi thư viện?`)) return;
    setDeletingFile(file.name);
    await fetch("/api/media/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket: file.bucket, filename: file.name }),
    });
    setDeletingFile(null);
    setFiles((prev) => prev.filter((f) => f.name !== file.name || f.bucket !== file.bucket));
  };

  const loadMore = async () => {
    setLoadingMore(true);
    const res = await fetch(`/api/media/list?offset=${loadOffset}`);
    const data = await res.json();
    setFiles((prev) => [...prev, ...(data.files ?? [])]);
    setHasMore(data.hasMore ?? false);
    setLoadOffset((prev) => prev + (data.files?.length ?? 0));
    setLoadingMore(false);
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", activeBucket);
    const res = await fetch("/api/media/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.error) {
      setUploadError(data.error);
      return;
    }
    onSelect(data.url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onMouseDown={onClose} />
      <div className="relative flex max-h-[80vh] w-full max-w-lg flex-col rounded-xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
          <button
            type="button"
            onMouseDown={onClose}
            className="rounded p-1 text-zinc-400 transition hover:text-zinc-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-zinc-200 px-4">
          {(["upload", "library"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setTab(t);
              }}
              className={[
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition",
                tab === t ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700",
              ].join(" ")}
            >
              {t === "upload" ? "Tải lên" : "Thư viện"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "upload" ? (
            <div className="space-y-4">
              <BucketSwitcher buckets={buckets} activeBucket={activeBucket} onChange={switchBucket} />

              <label className="block">
                <div
                  className="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 transition hover:border-zinc-400"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f && fileRef.current) {
                      const dt = new DataTransfer();
                      dt.items.add(f);
                      fileRef.current.files = dt.files;
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                >
                  {preview ? (
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                      <Image src={preview} alt="preview" fill className="object-contain" unoptimized />
                    </div>
                  ) : (
                    <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-center text-xs">
                        Kéo thả hoặc <span className="font-medium text-zinc-600">chọn file</span>
                        <br />
                        <span className="text-[11px] text-zinc-400">JPG, PNG, WebP · tối đa 5 MB</span>
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPreview(URL.createObjectURL(f));
                  }}
                />
              </label>

              {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
                disabled={uploading}
                className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Đang tải lên..." : uploadLabel}
              </button>
            </div>
          ) : (
            <div>
              {loading ? (
                <p className="py-8 text-center text-sm text-zinc-400">Đang tải...</p>
              ) : files.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-400">Chưa có ảnh nào trong thư viện.</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {files.map((f) => (
                      <div key={`${f.bucket}/${f.name}`} className="group relative aspect-square">
                        <button
                          type="button"
                          title={`Chọn ${f.name}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            onSelect(f.url);
                          }}
                          className="h-full w-full overflow-hidden rounded-lg border border-zinc-200 transition hover:ring-2 hover:ring-zinc-900"
                        >
                          <div className="relative h-full w-full">
                            <Image src={f.url} alt={f.name} fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                              <svg
                                className="opacity-0 drop-shadow-lg transition group-hover:opacity-100"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          title="Xóa ảnh"
                          disabled={deletingFile === f.name}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleDelete(f);
                          }}
                          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingFile === f.name ? (
                            <span className="text-[10px]">...</span>
                          ) : (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-3 text-center">
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          loadMore();
                        }}
                        disabled={loadingMore}
                        className="rounded-lg border border-zinc-300 px-5 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loadingMore ? "Đang tải..." : "Xem thêm"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
