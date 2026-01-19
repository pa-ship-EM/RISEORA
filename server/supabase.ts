import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // In development, we can warn instead of throwing if we want to allow the app to boot
    // but for the Vault feature, these are required.
    console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Document Vault features will be disabled.");
}

export const supabase = createClient(
    process.env.SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key"
);

export const VAULT_BUCKET = "user-documents";
