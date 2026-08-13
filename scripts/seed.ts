import { createClient } from "@supabase/supabase-js";
import { SEED_FACTS } from "../lib/content";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("Supabase credentials missing. Seed content is already embedded for local mode.");
    return;
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("fun_facts").upsert(SEED_FACTS, { onConflict: "id" });
  if (error) throw error;
  await supabase.from("admin_settings").upsert({ id: "default", leaderboard_enabled: true, hunt_enabled: true, announcement: null }, { onConflict: "id" });
  console.log(`Seeded ${SEED_FACTS.length} content cards.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
