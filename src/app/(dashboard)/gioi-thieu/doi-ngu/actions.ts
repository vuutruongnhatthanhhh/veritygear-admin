"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

function removeImageIfOwned(admin: ReturnType<typeof createAdminClient>, url: string | null) {
  if (!url) return;
  const path = url.split("/about-images/")[1];
  if (path) admin.storage.from("about-images").remove([path]);
}

export async function upsertTeamMember(_prev: string | null, formData: FormData): Promise<string | null> {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const deleteImage = formData.get("delete_image") === "1";
  const selectedUrl = ((formData.get("selected_url") as string) ?? "").trim();

  const payload: Record<string, unknown> = {
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    name: formData.get("name") as string,
    role_vi: formData.get("role_vi") as string,
    role_en: formData.get("role_en") as string,
    updated_at: new Date().toISOString(),
  };

  if (deleteImage) {
    payload.image_url = null;
  } else if (selectedUrl) {
    payload.image_url = selectedUrl;
  }

  if (id && id !== "") {
    if (deleteImage || selectedUrl) {
      const { data: current } = await admin
        .from("about_team_members")
        .select("image_url")
        .eq("id", parseInt(id))
        .single();
      if (current?.image_url && current.image_url !== selectedUrl) {
        removeImageIfOwned(admin, current.image_url);
      }
    }
    const { error } = await admin.from("about_team_members").update(payload).eq("id", parseInt(id));
    if (error) return error.message;
  } else {
    if (selectedUrl) payload.image_url = selectedUrl;
    const { error } = await admin.from("about_team_members").insert(payload);
    if (error) return error.message;
  }

  revalidatePath("/gioi-thieu/doi-ngu");
  return null;
}

export async function deleteTeamMember(formData: FormData) {
  const admin = createAdminClient();
  const id = formData.get("id") as string;
  const imageUrl = formData.get("image_url") as string;

  removeImageIfOwned(admin, imageUrl);

  await admin.from("about_team_members").delete().eq("id", parseInt(id));
  revalidatePath("/gioi-thieu/doi-ngu");
}
