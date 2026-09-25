"use client";

import { useState } from "react";
import { inputCls } from "@/components/cms-field";

type Spec = { label_vi: string; label_en: string; value_vi: string; value_en: string };

const EMPTY_SPEC: Spec = { label_vi: "", label_en: "", value_vi: "", value_en: "" };

export function SpecsEditor({ initialSpecs }: { initialSpecs: Spec[] }) {
  const [specs, setSpecs] = useState<Spec[]>(initialSpecs);

  function updateSpec(index: number, field: keyof Spec, value: string) {
    setSpecs((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addSpec() {
    setSpecs((prev) => [...prev, { ...EMPTY_SPEC }]);
  }

  function removeSpec(index: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-700">Thông số kỹ thuật</label>
        <button
          type="button"
          onClick={addSpec}
          className="text-xs font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          + Thêm thông số
        </button>
      </div>

      <input type="hidden" name="specs_json" value={JSON.stringify(specs)} readOnly />

      {specs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Chưa có thông số nào. Nhấn &quot;+ Thêm thông số&quot; để bắt đầu.
        </p>
      ) : (
        <div className="space-y-3">
          {specs.map((spec, i) => (
            <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  value={spec.label_vi}
                  onChange={(e) => updateSpec(i, "label_vi", e.target.value)}
                  placeholder="Nhãn (VI) — vd: Switch"
                  className={inputCls}
                />
                <input
                  value={spec.label_en}
                  onChange={(e) => updateSpec(i, "label_en", e.target.value)}
                  placeholder="Nhãn (EN) — e.g. Switches"
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  value={spec.value_vi}
                  onChange={(e) => updateSpec(i, "value_vi", e.target.value)}
                  placeholder="Giá trị (VI)"
                  className={inputCls}
                />
                <input
                  value={spec.value_en}
                  onChange={(e) => updateSpec(i, "value_en", e.target.value)}
                  placeholder="Giá trị (EN)"
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSpec(i)}
                className="mt-2 text-xs font-medium text-red-600 hover:underline"
              >
                Xóa thông số
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
