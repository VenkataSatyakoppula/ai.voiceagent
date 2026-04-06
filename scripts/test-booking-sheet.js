/**
 * Standalone test for selltis_save_booking_to_sheet.
 *
 * Recommended (matches production — axios/dotenv exist in container):
 *   docker compose -f docker-compose-gemini.yml exec avr-sts-gemini node -e "require('/usr/src/app/tools/selltis_save_booking_to_sheet.js').handler('test', { title: 'T', start_time_iso: '2026-12-01T16:00:00Z', duration_minutes: 30, caller_name: 'A', phone: '+15550001111', notes: 't' }).then(console.log)"
 *
 * From repo root with deps: npm i axios dotenv && node scripts/test-booking-sheet.js
 */
const path = require("path");
try {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
} catch (_) {}

const tool = require("../tools/selltis_save_booking_to_sheet.js");

async function main() {
  const url = process.env.SELLTIS_GOOGLE_SHEET_APPS_SCRIPT_URL;
  console.log("SELLTIS_GOOGLE_SHEET_APPS_SCRIPT_URL:", url ? "set" : "NOT SET");
  const out = await tool.handler("local-test-" + Date.now(), {
    title: "Local booking test",
    start_time_iso: "2026-12-01T16:00:00Z",
    duration_minutes: 30,
    caller_name: "Local Tester",
    phone: "+15550001111",
    notes: "scripts/test-booking-sheet.js",
  });
  console.log("\nResult:\n", out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
