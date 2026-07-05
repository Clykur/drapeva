import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger.js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error(
    "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables!",
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function getSupabaseClient(): Promise<SupabaseClient> {
  return supabase;
}

export class SupabaseStorageService {
  static async uploadImage(fileBuffer: Buffer, folder: string = "maaya"): Promise<string> {
    const client = supabase;
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(4)}.jpg`;

    try {
      const { error } = await client.storage.from("maaya-assets").upload(filename, fileBuffer, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: true,
      });

      if (error) {
        logger.error("Supabase storage upload error", { message: error.message });
        return `https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?w=600&q=80`;
      }

      const { data: urlData } = client.storage.from("maaya-assets").getPublicUrl(filename);

      return urlData.publicUrl;
    } catch (err: unknown) {
      logger.error("Supabase upload failed", {
        message: err instanceof Error ? err.message : String(err),
      });
      return `https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?w=600&q=80`;
    }
  }
}
