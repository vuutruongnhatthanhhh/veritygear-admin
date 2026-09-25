import { createClient } from "@/lib/supabase/server";
import { CategoryGridForm } from "./category-grid-form";
import { FeaturedProductsForm } from "./featured-products-form";
import { ProductSpotlightForm } from "./product-spotlight-form";

export const metadata = { title: "Khu vực sản phẩm - Trang chủ" };

export default async function KhuVucSanPhamPage() {
  const supabase = await createClient();
  const [{ data: categoryGrid }, { data: featuredProducts }, { data: productSpotlight }] = await Promise.all([
    supabase.from("home_category_grid").select("*").eq("id", 1).single(),
    supabase.from("home_featured_products").select("*").eq("id", 1).single(),
    supabase.from("home_product_spotlight").select("*").eq("id", 1).single(),
  ]);

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="mb-2 text-xl font-semibold text-zinc-900">Khu vực sản phẩm</h1>
        <p className="text-sm text-zinc-500">
          Nội dung các khối liên quan đến sản phẩm trên trang chủ: lưới danh mục, sản phẩm nổi bật, sản phẩm chủ lực.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-900">Lưới danh mục</h2>
        <CategoryGridForm content={categoryGrid} />
      </section>

      <section className="space-y-4 border-t border-zinc-200 pt-8">
        <h2 className="text-base font-semibold text-zinc-900">Sản phẩm nổi bật</h2>
        <FeaturedProductsForm content={featuredProducts} />
      </section>

      <section className="space-y-4 border-t border-zinc-200 pt-8">
        <h2 className="text-base font-semibold text-zinc-900">Sản phẩm chủ lực (Spotlight)</h2>
        <ProductSpotlightForm content={productSpotlight} />
      </section>
    </div>
  );
}
