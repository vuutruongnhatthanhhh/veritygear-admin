import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";

// How many files to pull per bucket before merging — buckets are small
// (admin-uploaded content images), so this comfortably covers everything.
const PER_BUCKET_LIMIT = 200;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const PAGE_SIZE = 30;
  const offset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0", 10) || 0;

  const admin = createAdminClient();

  const { data: bucketList, error: bucketsError } = await admin.storage.listBuckets();
  if (bucketsError) return Response.json({ error: bucketsError.message }, { status: 500 });

  const publicBuckets = (bucketList ?? []).filter((b) => b.public);

  const perBucketResults = await Promise.all(
    publicBuckets.map(async (b) => {
      const { data } = await admin.storage.from(b.id).list("", {
        limit: PER_BUCKET_LIMIT,
        sortBy: { column: "created_at", order: "desc" },
      });
      return (data ?? [])
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => ({
          name: f.name,
          bucket: b.id,
          createdAt: f.created_at ?? "",
          url: admin.storage.from(b.id).getPublicUrl(f.name).data.publicUrl,
        }));
    }),
  );

  const merged = perBucketResults
    .flat()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));

  const hasMore = merged.length > offset + PAGE_SIZE;
  const files = merged.slice(offset, offset + PAGE_SIZE).map(({ name, url, bucket }) => ({ name, url, bucket }));

  return Response.json({ files, hasMore });
}
