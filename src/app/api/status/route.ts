import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const game = searchParams.get("game");

  const supabase = createAdminClient();

  if (game) {
    const { data: dbGame } = await supabase
      .from("games")
      .select("id")
      .eq("slug", game)
      .single();

    if (!dbGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("server_status")
      .select("*")
      .eq("game_id", dbGame.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: data });
  }

  // Return all games status
  const { data: games } = await supabase
    .from("games")
    .select("id, slug, name")
    .eq("is_active", true);

  if (!games) {
    return NextResponse.json({ statuses: [] });
  }

  const statuses = await Promise.all(
    games.map(async (g) => {
      const { data } = await supabase
        .from("server_status")
        .select("*")
        .eq("game_id", g.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      return { game: g.slug, name: g.name, ...data };
    })
  );

  return NextResponse.json({ statuses });
}
