import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "./supabase";

export async function checkIdempotency(request: Request): Promise<{
  key: string | null;
  cachedResponse: NextResponse | null;
}> {
  if (!["POST", "PATCH", "PUT", "DELETE"].includes(request.method)) {
    return { key: null, cachedResponse: null };
  }

  const key = request.headers.get("idempotency-key");
  if (!key) {
    return { key: null, cachedResponse: null };
  }

  try {
    const supabase = getSupabaseAdmin() as any;
    const { data, error } = await supabase
      .from("IdempotencyRequest")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (data) {
      console.log(`[Next.js Idempotency] Key match found: ${key}. Returning cached response.`);
      const body = JSON.parse(data.responseBody);
      return {
        key,
        cachedResponse: NextResponse.json(body, {
          status: data.responseStatus,
          headers: { "X-Cache-Idempotency": "true" },
        }),
      };
    }

    return { key, cachedResponse: null };
  } catch (err: any) {
    console.error("[Next.js Idempotency Error]:", err.message);
    return { key, cachedResponse: null };
  }
}

export async function saveIdempotency(key: string, status: number, body: any) {
  try {
    const supabase = getSupabaseAdmin() as any;
    await supabase.from("IdempotencyRequest").insert({
      id: crypto.randomUUID(),
      key,
      responseStatus: status,
      responseBody: JSON.stringify(body),
    });
  } catch (err: any) {
    console.error("[Next.js Idempotency Save Error]:", err.message);
  }
}
