export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-900">
          Verity Gear Admin
        </p>
        {children}
      </div>
    </div>
  );
}
