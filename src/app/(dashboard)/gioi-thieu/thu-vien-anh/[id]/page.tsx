import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { GalleryImageForm } from "./gallery-image-form";

export const metadata = { title: "Chỉnh sửa ảnh" };

export default async function GalleryImageItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm ảnh mới</h1>
        <GalleryImageForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("about_gallery_images")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa ảnh</h1>
      <GalleryImageForm item={item} />
    </div>
  );
}
