"use client";

import { useState } from "react";

export type CustomerRow = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  provider: string;
  createdAt: string;
  lastSignInAt?: string;
  emailConfirmedAt?: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function providerLabel(provider: string) {
  return provider === "google" ? "Google" : "Email";
}

export function CustomerListClient({ customers }: { customers: CustomerRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? customers.filter(
        (c) =>
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.fullName.toLowerCase().includes(search.toLowerCase()),
      )
    : customers;

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Tìm theo email hoặc tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white py-2 pr-3 pl-9 text-sm text-zinc-900 placeholder-zinc-400 transition focus:ring-2 focus:ring-zinc-900 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-500">Không tìm thấy khách hàng nào.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-lg border border-zinc-200 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium text-zinc-900">{c.fullName || c.email}</span>
                  <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                    {providerLabel(c.provider)}
                  </span>
                  {!c.emailConfirmedAt && (
                    <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                      Chưa xác nhận email
                    </span>
                  )}
                </div>
                {c.fullName && <div className="mt-0.5 text-xs break-all text-zinc-400">{c.email}</div>}
                {c.phone && <div className="mt-0.5 text-xs text-zinc-400">SĐT: {c.phone}</div>}
                {c.address && <div className="mt-0.5 text-xs break-words text-zinc-400">Địa chỉ: {c.address}</div>}
                <div className="mt-0.5 text-xs text-zinc-400">
                  Đăng ký: {formatDate(c.createdAt)}
                  {c.lastSignInAt && ` · Đăng nhập gần nhất: ${formatDate(c.lastSignInAt)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
