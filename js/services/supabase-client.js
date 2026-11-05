import { supabaseConfig } from "../supabase-config.js";

const SUPABASE_MODULE_URL = "https://esm.sh/@supabase/supabase-js@2";

let clientPromise;

export async function getOptionalSupabaseClient() {
  if (!supabaseConfig.url || !supabaseConfig.publishableKey) {
    return null;
  }

  if (!clientPromise) {
    clientPromise = (async () => {
      const { createClient } = await import(SUPABASE_MODULE_URL);
      return createClient(supabaseConfig.url, supabaseConfig.publishableKey, {
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
    throw new Error("Isi URL dan publishable key Supabase di js/supabase-config.js.");
  }
  return client;
}
