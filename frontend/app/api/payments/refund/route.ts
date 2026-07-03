import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkIdempotency, saveIdempotency } from "@/lib/idempotency";

// Uses Supabase SSR (Node.js cookie APIs) — pin to Node.js runtime.
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { key, cachedResponse } = await checkIdempotency(request);
    if (cachedResponse) return cachedResponse;

    const { orderId, amount } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Refund logic placeholder
    console.log(`[Refund API] Triggered refund of ${amount || "full"} for Order ${orderId}`);

    // Update order status in Supabase
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "refunded",
        status: "returned",
      })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update order status in Supabase" },
        { status: 500 },
      );
    }

    const resPayload = { success: true, message: "Refund processed successfully" };
    if (key) {
      await saveIdempotency(key, 200, resPayload);
    }

    return NextResponse.json(resPayload);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
