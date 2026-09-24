"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cms-toast";

// Called from a form right before router.push() back to a list page, so the
// list page can show a confirmation after the redirect completes.
export function announceToast(message: string) {
  sessionStorage.setItem(STORAGE_KEY, message);
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}

// Drop this on any list page whose edit/create form redirects back via
// announceToast() — picks up the message left in sessionStorage, shows it
// once, then clears it so a page refresh doesn't repeat it.
export function ToastFromSession() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessage(stored);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  if (!message) return null;
  return <Toast message={message} onDone={() => setMessage(null)} />;
}
