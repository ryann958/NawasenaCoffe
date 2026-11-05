import { getSupabaseClient, requireAdmin } from "./admin-core.js";

const status = document.querySelector("[data-entry-status]");

try {
  const client = await getSupabaseClient();
  const user = await requireAdmin(client);

  if (user) {
    window.location.replace("/admin/dashboard");
  }
} catch (error) {
  status.textContent = "Silakan masuk ke halaman login admin.";
  window.location.replace("/admin/login");
}
