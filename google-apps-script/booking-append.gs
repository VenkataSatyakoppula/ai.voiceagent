/**
 * Deploy as Web app: Deploy > New deployment > Type: Web app
 * - Execute as: Me
 * - Who has access: Anyone   <-- required for Docker/voice server POST without Google login
 *   ("Anyone with Google account" often causes HTTP 401 from server-side clients.)
 *
 * After changing the script, click Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy.
 * Copy the Web app URL ending in /exec into SELLTIS_GOOGLE_SHEET_APPS_SCRIPT_URL
 *
 * Set SHEET_ID to your spreadsheet ID (from the Google Sheet URL, between /d/ and /edit).
 * The account that owns the script must have edit access to the sheet.
 */
const SHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Bookings';

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return jsonOut({ ok: false, error: 'no body' });
  }
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut({ ok: false, error: 'invalid json' });
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'created_at',
      'session_uuid',
      'title',
      'start_time',
      'duration_minutes',
      'lead_id',
      'opportunity_id',
      'attendee_email',
      'notes',
      'phone',
      'caller_name',
    ]);
  }

  sh.appendRow([
    new Date().toISOString(),
    payload.session_uuid || '',
    payload.title || '',
    payload.start_time_iso || '',
    payload.duration_minutes || '',
    payload.lead_id || '',
    payload.opportunity_id || '',
    payload.attendee_email || '',
    payload.notes || '',
    payload.phone || '',
    payload.caller_name || '',
  ]);

  return jsonOut({ ok: true, message: 'row appended' });
}

function doGet() {
  return ContentService.createTextOutput('booking-append webhook: use POST JSON');
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
