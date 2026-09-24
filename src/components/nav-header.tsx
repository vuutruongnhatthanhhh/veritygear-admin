"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./logout-button";

type NavChild = { href: string; label: string };
type NavGroup = { label: string; children: NavChild[] };

const navItems: NavGroup[] = [
  {
    label: "Tài khoản",
    children: [
      { href: "/tai-khoan/nhan-vien", label: "Nhân viên" },
      { href: "/tai-khoan/khach-hang", label: "Khách hàng" },
    ],
  },
  {
    label: "Trang chủ",
    children: [
      { href: "/trang-chu/hero", label: "Hero" },
      { href: "/trang-chu/marquee", label: "Slide chữ" },
      { href: "/trang-chu/tinh-nang", label: "Tính năng" },
      { href: "/trang-chu/cau-chuyen-thuong-hieu", label: "Câu chuyện thương hiệu" },
      { href: "/trang-chu/danh-gia", label: "Đánh giá" },
      { href: "/trang-chu/ban-tin", label: "Bản tin" },
    ],
  },
  {
    label: "Giới thiệu",
    children: [
      { href: "/gioi-thieu/banner", label: "Banner" },
      { href: "/gioi-thieu/su-menh", label: "Sứ mệnh" },
      { href: "/gioi-thieu/cau-chuyen", label: "Câu chuyện" },
      { href: "/gioi-thieu/thong-ke", label: "Thống kê" },
      { href: "/gioi-thieu/gia-tri-cot-loi", label: "Giá trị cốt lõi" },
      { href: "/gioi-thieu/doi-ngu", label: "Đội ngũ" },
      { href: "/gioi-thieu/thu-vien-anh", label: "Thư viện ảnh" },
      { href: "/gioi-thieu/cta", label: "CTA cuối trang" },
    ],
  },
];

const allHrefs = navItems.flatMap((item) => item.children.map((c) => c.href));

export function NavHeader({ email, role }: { email: string; role: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const bestMatch = allHrefs
    .filter((href) => pathname === href || pathname.startsWith(href + "/"))
    .sort((a, b) => b.length - a.length)[0];

  const isActive = (href: string) => href === bestMatch;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const itemCls = (active: boolean) =>
    `px-3 py-2 text-sm rounded-md transition whitespace-nowrap flex items-center justify-between gap-2 ${
      active
        ? "bg-zinc-100 text-zinc-900 font-medium"
        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
    }`;

  const nav = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-0.5 px-2 py-3">
      {navItems.map((item) => (
        <div key={item.label} className="mt-3 first:mt-0">
          <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
            {item.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {item.children.map((child) => (
              <Link key={child.href} href={child.href} onClick={onNavigate} className={itemCls(isActive(child.href))}>
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  const roleLabel = role === "admin" ? "Admin" : "Mod";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-zinc-200 bg-white md:flex">
        <div className="flex h-12 shrink-0 items-center border-b border-zinc-200 px-4">
          <span className="text-sm font-semibold text-zinc-900">VERITY GEAR Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto">{nav()}</div>
        <div className="border-t border-zinc-200 px-4 py-4">
          <span className="mb-1 block truncate text-xs text-zinc-500">{email}</span>
          <span className="mb-2 inline-block rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
            {roleLabel}
          </span>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-b border-zinc-200 bg-white px-4 md:hidden">
        <span className="text-sm font-semibold text-zinc-900">VERITY GEAR Admin</span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          className="rounded-md p-2 text-zinc-600 transition hover:bg-zinc-100"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setOpen(false)} />
      )}

      {open && (
        <aside className="fixed top-12 bottom-0 left-0 z-40 flex w-56 flex-col overflow-y-auto border-r border-zinc-200 bg-white md:hidden">
          {nav(() => setOpen(false))}
          <div className="mt-auto border-t border-zinc-200 px-4 py-4">
            <span className="mb-1 block truncate text-xs text-zinc-500">{email}</span>
            <span className="mb-2 inline-block rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
              {roleLabel}
            </span>
            <LogoutButton />
          </div>
        </aside>
      )}
    </>
  );
}
