import cron from "node-cron";
import { processAutoReplies } from "../emailAutoReply/emailAutoReply.js";

// =======================
// Runs auto-reply processing every 15 minutes
// =======================
cron.schedule("*/15 * * * *", async () => {
  console.log("🔄 Running Auto-Reply Cron Job...");

  try {
    await processAutoReplies("115366027924432208882");
    console.log("✅ Auto-Reply Process Completed.");
  } catch (error) {
    console.error("❌ Auto-Reply Cron Job Error:", error.message);
  }
});
