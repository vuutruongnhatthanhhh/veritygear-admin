import { inputCls, textareaCls } from "./cms-field";

type Props = {
  label: string;
  nameVi: string;
  nameEn: string;
  defaultVi?: string;
  defaultEn?: string;
  multiline?: boolean;
  required?: boolean;
};

export function BilingualPair({ label, nameVi, nameEn, defaultVi, defaultEn, multiline, required }: Props) {
  const Tag = multiline ? "textarea" : "input";
  const cls = multiline ? textareaCls : inputCls;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-700">{label}</label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">VI</span>
          <Tag
            name={nameVi}
            defaultValue={defaultVi}
            required={required}
            rows={multiline ? 3 : undefined}
            className={cls}
          />
        </div>
        <div>
          <span className="mb-1 block text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">EN</span>
          <Tag
            name={nameEn}
            defaultValue={defaultEn}
            rows={multiline ? 3 : undefined}
            className={cls}
          />
        </div>
      </div>
    </div>
  );
}
