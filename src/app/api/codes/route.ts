import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get("game");
  const active = searchParams.get("active");

  const supabase = createAdminClient();

  let query = supabase.from("codes").select("*, games!inner(slug, name)");

  if (game) {
    query = query.eq("games.slug", game);
  }

  if (active === "true") {
    query = query.eq("is_active", true);
  } else if (active === "false") {
    query = query.eq("is_active", false);
  }

  const { data, error } = await query.order("discovered_at", { ascending: false }).limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ codes: data });
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { game_id, code, rewards, source, source_url, region, expires_at } = body;

  if (!game_id || !code) {
    return NextResponse.json({ error: "game_id and code are required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("codes")
    .upsert(
      {
        game_id,
        code: code.toUpperCase().trim(),
        rewards,
        source,
        source_url,
        region: region || "global",
        expires_at,
        is_active: true,
        is_verified: true,
      },
      { onConflict: "game_id,code" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: data }, { status: 201 });
}
