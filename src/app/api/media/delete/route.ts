import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { bucket, filename } = (await request.json()) as { bucket?: string; filename?: string };

  if (!bucket) return Response.json({ error: "Thiếu thư mục (bucket)" }, { status: 400 });
  if (!filename) return Response.json({ error: "Thiếu filename" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).remove([filename]);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
