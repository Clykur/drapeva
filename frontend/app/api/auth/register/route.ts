import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, phone, password, name } = await request.json();

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Restrict duplicates
    if (email) {
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (checkError) {
        console.error("Duplicate check error:", checkError);
      }
      if (existingUser) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
    }

    if (phone) {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("phone", formattedPhone)
        .maybeSingle();

      if (checkError) {
        console.error("Duplicate check error:", checkError);
      }
      if (existingUser) {
        return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
      }
    }

    // 2. Create the user in auth.users
    const createUserParams: any = {
      password,
      user_metadata: { name, role: "customer", phone: phone || "" },
    };

    if (email) {
      createUserParams.email = email;
      createUserParams.email_confirm = true;
    } else if (phone) {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
      createUserParams.phone = formattedPhone;
      createUserParams.phone_confirm = true;
    } else {
      return NextResponse.json({ error: "Either email or phone is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser(createUserParams);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 3. Fail-safe: Manually upsert profile to guarantee it exists (even if trigger fails)
    const formattedPhone = phone
      ? phone.startsWith("+")
        ? phone
        : `+91${phone.replace(/\D/g, "")}`
      : null;
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: data.user.id,
      email: email || null,
      name: name,
      phone: formattedPhone,
      role: "customer",
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Fail-safe profile creation failed:", profileError);
      // Clean up the auth user to prevent an orphaned user in auth.users
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      } catch (deleteError) {
        console.error("Failed to delete auth user after profile failure:", deleteError);
      }
      return NextResponse.json(
        {
          error: `Registration partially failed: could not create profile. ${profileError.message}`,
        },
        { status: 500 },
      );
    }

    // 4. Double check that the profile record actually exists in the database
    const { data: profileCheck, error: checkError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (checkError || !profileCheck) {
      console.error("Profile verification check failed:", checkError);
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      } catch (deleteError) {
        console.error("Failed to delete auth user after verification failure:", deleteError);
      }
      return NextResponse.json(
        { error: "Verification failed: user profile could not be verified in the database." },
        { status: 500 },
      );
    }

    return NextResponse.json({ user: data.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
