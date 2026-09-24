"use client";

import { useState } from "react";
import { NewsletterForm } from "./newsletter-form";
import { SubscribersList, type Subscriber } from "./subscribers-list";

type Newsletter = Parameters<typeof NewsletterForm>[0]["newsletter"];
type Tab = "content" | "subscribers";

export function BanTinTabs({ newsletter, subscribers }: { newsletter: Newsletter; subscribers: Subscriber[] }) {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div>
      <div className="mb-5 flex border-b border-zinc-200">
        {([
          ["content", "Nội dung"],
          ["subscribers", `Người đăng ký (${subscribers.length})`],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={[
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition",
              tab === key ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "content" ? <NewsletterForm newsletter={newsletter} /> : <SubscribersList subscribers={subscribers} />}
    </div>
  );
}
