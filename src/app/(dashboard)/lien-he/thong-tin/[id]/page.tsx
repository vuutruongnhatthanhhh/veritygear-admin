import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ContactCardForm } from "./contact-card-form";

export const metadata = { title: "Chỉnh sửa thông tin liên hệ" };

export default async function ContactCardItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm thông tin mới</h1>
        <ContactCardForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("contact_info_cards")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa thông tin liên hệ</h1>
      <ContactCardForm item={item} />
    </div>
  );
}
