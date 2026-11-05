import { getSupabaseClient } from "../../js/services/supabase-client.js";

export { getSupabaseClient };

export async function requireAdmin(client) {
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) {
    throw sessionError;
  }
  if (!sessionData.session) {
    window.location.replace("/admin/login");
    return null;
  }

  const { data: membership, error } = await client
    .from("admin_members")
    .select("user_id, is_active")
    .eq("user_id", sessionData.session.user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }
  if (!membership?.is_active) {
    await client.auth.signOut();
    window.location.replace("/admin/login?reason=not-authorized");
    return null;
  }

  return sessionData.session.user;
}

export function showMessage(container, message, kind = "error") {
  container.textContent = message;
  container.className = `admin-message admin-message--${kind}`;
  container.hidden = false;
}

export function formatError(error) {
  return error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

export async function uploadImage(client, file, folder, id) {
  if (!(file instanceof File)) {
    return null;
  }

  const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  if (!allowedTypes.has(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, WebP, atau AVIF.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  const extension = extensions[file.type];
  const path = `${folder}/${id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage
    .from("nawasena-content")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw error;
  }
  return path;
}

export async function createImagePreview(client, imagePath) {
  if (!imagePath) {
    return "";
  }
  const { data, error } = await client.storage
    .from("nawasena-content")
    .createSignedUrl(imagePath, 300);
  if (error) {
    throw error;
  }
  return data.signedUrl;
}

export async function removeImage(client, imagePath) {
  if (!imagePath) {
    return;
  }
  const { error } = await client.storage
    .from("nawasena-content")
    .remove([imagePath]);
  if (error) {
    throw error;
  }
}
