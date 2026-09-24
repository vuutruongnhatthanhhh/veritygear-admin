import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TestimonialForm } from "./testimonial-form";

export const metadata = { title: "Chỉnh sửa đánh giá" };

export default async function TestimonialItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm đánh giá mới</h1>
        <TestimonialForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("home_testimonials")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa đánh giá</h1>
      <TestimonialForm item={item} />
    </div>
  );
}
