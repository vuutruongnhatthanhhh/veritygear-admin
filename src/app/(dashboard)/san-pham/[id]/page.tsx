import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductForm } from "./product-form";

export const metadata = { title: "Chỉnh sửa sản phẩm" };

export default async function ProductItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: categories } = await supabase.from("product_categories").select("id, name_vi").order("sort_order");

  if (id === "new") {
    return (
      <div className="max-w-2xl">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Thêm sản phẩm mới</h1>
        <ProductForm item={null} specs={[]} categories={categories ?? []} />
      </div>
    );
  }

  const [{ data: item, error }, { data: specs }] = await Promise.all([
    supabase.from("products").select("*").eq("id", parseInt(id)).single(),
    supabase.from("product_specs").select("*").eq("product_id", parseInt(id)).order("sort_order"),
  ]);

  if (error || !item) return notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900">Chỉnh sửa sản phẩm</h1>
      <ProductForm item={item} specs={specs ?? []} categories={categories ?? []} />
    </div>
  );
}
