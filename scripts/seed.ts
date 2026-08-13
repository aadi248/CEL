import { firebaseDb, hasFirebaseEnv } from "../lib/firebase-admin";
import { SEED_FACTS } from "../lib/content";

async function main() {
  if (!hasFirebaseEnv()) {
    console.log("Firebase Admin credentials are missing. Seed content remains embedded for local development mode.");
    return;
  }
  const db = firebaseDb();
  let batch = db.batch();
  let operations = 0;
  for (const item of SEED_FACTS) {
    batch.set(db.collection("fun_facts").doc(item.id), item, { merge: true });
    operations += 1;
    if (operations === 400) {
      await batch.commit();
      batch = db.batch();
      operations = 0;
    }
  }
  batch.set(db.collection("admin_settings").doc("default"), {
    id: "default",
    leaderboard_enabled: true,
    hunt_enabled: true,
    announcement: null
  }, { merge: true });
  await batch.commit();
  console.log(`Seeded ${SEED_FACTS.length} content cards into Firestore.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
