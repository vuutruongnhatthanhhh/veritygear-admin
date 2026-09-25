import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FaqForm } from "./faq-form";

export const metadata = { title: "Chỉnh sửa câu hỏi" };

export default async function FaqItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm câu hỏi mới</h1>
        <FaqForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase.from("contact_faqs").select("*").eq("id", parseInt(id)).single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa câu hỏi</h1>
      <FaqForm item={item} />
    </div>
  );
}
