"use client";

import { useState } from "react";
import { UserList, type UserRow } from "./user-list";
import { CreateUserForm } from "./create-user-form";
import { ChangePasswordForm } from "./change-password-form";

type Tab = "list" | "password";

export function UsersClient({
  users,
  isAdmin,
  currentUserId,
}: {
  users: UserRow[];
  isAdmin: boolean;
  currentUserId: string;
}) {
  const [tab, setTab] = useState<Tab>("list");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = search.trim()
    ? users.filter(
        (u) =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.full_name.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  return (
    <div>
      <div className="mb-5 flex border-b border-zinc-200">
        {([
          ["list", "Danh sách"],
          ["password", "Đổi mật khẩu"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={[
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition",
              tab === key
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            {label}
            {key === "list" && <span className="ml-1.5 text-xs text-zinc-400">({users.length})</span>}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
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
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowCreate((v) => !v)}
                className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                {showCreate ? "Đóng" : "+ Tạo mới"}
              </button>
            )}
          </div>

          {isAdmin && showCreate && (
            <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="text-sm font-semibold text-zinc-900">Tạo tài khoản mới</h3>
              <CreateUserForm />
            </div>
          )}

          <UserList users={filtered} isAdmin={isAdmin} currentUserId={currentUserId} />
        </div>
      )}

      {tab === "password" && (
        <div className="max-w-md">
          <ChangePasswordForm />
        </div>
      )}
    </div>
  );
}
