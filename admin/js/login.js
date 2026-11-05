import { formatError, getSupabaseClient, showMessage } from "./admin-core.js";

const form = document.querySelector("[data-login-form]");
const message = document.querySelector("[data-login-message]");
const submitButton = form.querySelector("[data-submit-button]");

if (new URLSearchParams(window.location.search).get("reason") === "not-authorized") {
  showMessage(message, "Akun ini tidak memiliki akses admin.");
}

try {
  const client = await getSupabaseClient();
  const { data, error } = await client.auth.getSession();
  if (error) {
    throw error;
  }
  if (data.session) {
    window.location.replace("/admin/dashboard");
  }
} catch (error) {
  showMessage(message, formatError(error));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.hidden = true;
  submitButton.disabled = true;

  try {
    const client = await getSupabaseClient();
    const values = new FormData(form);
    const { data, error } = await client.auth.signInWithPassword({
      email: String(values.get("email")).trim(),
      password: String(values.get("password")),
    });

    if (error) {
      throw error;
    }

    const { data: membership, error: membershipError } = await client
      .from("admin_members")
      .select("is_active")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (membershipError) {
      throw membershipError;
    }
    if (!membership?.is_active) {
      await client.auth.signOut();
      throw new Error("Akun ini belum diberi akses admin.");
    }

    window.location.replace("/admin/dashboard");
  } catch (error) {
    showMessage(message, formatError(error));
  } finally {
    submitButton.disabled = false;
  }
});
