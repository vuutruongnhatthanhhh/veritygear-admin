"use client";

import { useState } from "react";

export type Subscriber = { id: number; email: string; created_at: string };

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function SubscribersList({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    : subscribers;

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Tìm theo email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition focus:ring-2 focus:ring-zinc-900 focus:outline-none"
      />

      {filtered.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-500">Chưa có người đăng ký nào.</p>
      ) : (
        <div className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-white px-4 py-2.5">
              <span className="text-sm text-zinc-900">{s.email}</span>
              <span className="text-xs text-zinc-400">{formatDate(s.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
