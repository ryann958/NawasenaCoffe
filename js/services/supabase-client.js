const SUPABASE_MODULE_URL = "https://esm.sh/@supabase/supabase-js@2";

let configPromise;
let clientPromise;

async function loadConfig() {
  if (!configPromise) {
    configPromise = (async () => {
      if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
        return null;
      }

      const response = await fetch("/api/config", { cache: "no-store" });
      if (response.status === 404) {
        return null;
      }
      const config = await response.json();

      if (response.ok && config.configured === false) {
        return null;
      }
      if (!response.ok || !config.configured) {
        throw new Error(config.message || "Konfigurasi Supabase tidak dapat dimuat.");
      }
      return config;
    })();
  }
  return configPromise;
}

export async function getOptionalSupabaseClient() {
  const config = await loadConfig();
  if (!config) {
    return null;
  }

  if (!clientPromise) {
    clientPromise = (async () => {
      const { createClient } = await import(SUPABASE_MODULE_URL);
      return createClient(config.supabaseUrl, config.supabaseKey, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
        },
      });
    })();
  }
  return clientPromise;
}

export async function getSupabaseClient() {
  const client = await getOptionalSupabaseClient();
  if (!client) {
    throw new Error("Supabase belum dikonfigurasi untuk deployment ini.");
  }
  return client;
}
