import { getSupabaseClient, requireAdmin } from "./admin-core.js";

const status = document.querySelector("[data-entry-status]");

try {
  const client = await getSupabaseClient();
  const user = await requireAdmin(client);

  if (user) {
    window.location.replace("/admin/dashboard");
  }
} catch (error) {
  status.textContent = error instanceof Error ? error.message : "Admin belum dapat dimuat.";
  status.classList.add("admin-message--error");
}
