"use client";

import { useEffect, useRef, useState } from "react";
import { inputCls } from "./cms-field";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

function displayToIso(display: string): string {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";
  const [, d, m, y] = match;
  return `${y}-${m}-${d}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Monday-first weekday index (0 = Monday .. 6 = Sunday) for the 1st of the month.
function firstWeekdayOffset(year: number, monthIndex: number): number {
  const jsDay = new Date(year, monthIndex, 1).getDay();
  return (jsDay + 6) % 7;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function Calendar({
  iso,
  onSelect,
  onClose,
}: {
  iso: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const selected = iso ? new Date(`${iso}T00:00:00`) : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  const offset = firstWeekdayOffset(viewYear, viewMonth);
  const total = daysInMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  return (
    <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            changeMonth(-1);
          }}
          className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-100"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-zinc-900">
          {MONTH_NAMES[viewMonth]}, {viewYear}
        </span>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            changeMonth(1);
          }}
          className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-400">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />;
          const cellIso = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
          const isSelected = cellIso === iso;
          const isToday =
            day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          return (
            <button
              key={day}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(cellIso);
                onClose();
              }}
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs transition",
                isSelected
                  ? "bg-zinc-900 text-white"
                  : isToday
                    ? "border border-zinc-300 text-zinc-900"
                    : "text-zinc-700 hover:bg-zinc-100",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Native <input type="date"> renders its text using the browser/OS locale
// (often mm/dd/yyyy on en-US systems) regardless of any app-level locale —
// this hand-rolled field guarantees dd/mm/yyyy display everywhere via a
// custom calendar popup, converting to/from the yyyy-mm-dd string the
// server action and DATE column expect.
export function DateField({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [iso, setIso] = useState(defaultValue ?? "");
  const [display, setDisplay] = useState(isoToDisplay(defaultValue ?? ""));
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleTyped(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDisplay(formatted);
    setIso(displayToIso(formatted));
  }

  function handlePicked(pickedIso: string) {
    setIso(pickedIso);
    setDisplay(isoToDisplay(pickedIso));
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={(e) => handleTyped(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="dd/mm/yyyy"
          maxLength={10}
          className={`${inputCls} pr-9`}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Chọn ngày"
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-zinc-400 transition hover:text-zinc-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
      </div>

      {open && <Calendar iso={iso} onSelect={handlePicked} onClose={() => setOpen(false)} />}

      <input type="hidden" name={name} value={iso} readOnly />
    </div>
  );
}
