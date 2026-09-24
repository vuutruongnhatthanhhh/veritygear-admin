import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;

  if (!file || file.size === 0) return Response.json({ error: "Thiếu file" }, { status: 400 });
  if (!bucket) return Response.json({ error: "Thiếu thư mục (bucket)" }, { status: 400 });

  const fileName = `img-${Date.now()}.webp`;
  const bytes = Buffer.from(await file.arrayBuffer());

  let webp: Buffer;
  try {
    webp = await sharp(bytes).webp({ quality: 82 }).toBuffer();
  } catch {
    return Response.json({ error: "Không đọc được ảnh, vui lòng thử file khác" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).upload(fileName, webp, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data: urlData } = admin.storage.from(bucket).getPublicUrl(fileName);
  return Response.json({ url: urlData.publicUrl });
}
