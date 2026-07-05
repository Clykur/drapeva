/**
 * Client-side Supabase singleton.
 *
 * This file is ONLY imported by client components and lib files
 * used in the browser (api.ts, auth-store.ts, storage.ts, etc.).
 *
 * For server-side usage (API routes, Server Components), use
 * @/lib/supabase/server — which creates a per-request client.
 *
 * For admin/service-role operations (webhooks), use getSupabaseAdmin()
 * from this file — it creates a fresh client per call so it is never
 * instantiated at module scope during build time.
 */

import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database, MakeDatabaseCompat } from "./types";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient<MakeDatabaseCompat<Database>> | null = null;

const getSupabaseBrowserClient = (): SupabaseClient<MakeDatabaseCompat<Database>> => {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!url || !anonKey) {
      if (typeof window !== "undefined") {
        console.warn(
          "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
            "Check your .env.local file.",
        );
      }
      throw new Error(
        "@supabase/ssr: Your project's URL and API key are required. " +
          "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
      );
    }
    supabaseInstance = createBrowserClient<MakeDatabaseCompat<Database>>(
      url,
      anonKey,
    ) as unknown as SupabaseClient<MakeDatabaseCompat<Database>>;
  }
  return supabaseInstance;
};

// Browser client proxy — safe lazy instantiation to prevent import-time side-effects
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getSupabaseBrowserClient();
    const value = Reflect.get(client, prop);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
}) as unknown as SupabaseClient<MakeDatabaseCompat<Database>>;

/**
 * Returns an admin Supabase client using the service role key.
 * MUST only be called server-side (API routes / Server Actions).
 * Creates a fresh client per call — never cached at module scope.
 */
export const getSupabaseAdmin = (): SupabaseClient<MakeDatabaseCompat<Database>> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "Missing env var: SUPABASE_SERVICE_ROLE_KEY. " +
        "This is required for admin / webhook Supabase operations.",
    );
  }
  return createSupabaseClient<MakeDatabaseCompat<Database>>(
    url,
    serviceKey,
  ) as unknown as SupabaseClient<MakeDatabaseCompat<Database>>;
};
