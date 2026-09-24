import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StoryBlockForm } from "./story-block-form";

export const metadata = { title: "Chỉnh sửa câu chuyện" };

export default async function StoryBlockItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="max-w-xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm câu chuyện mới</h1>
        <StoryBlockForm item={null} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("about_story_blocks")
    .select("*")
    .eq("id", parseInt(id))
    .single();

  if (error || !item) return notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa câu chuyện</h1>
      <StoryBlockForm item={item} />
    </div>
  );
}
