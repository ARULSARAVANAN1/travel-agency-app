const SHEET_NAME = "Travel Requests";
const HEADERS = ["Submitted At", "Name", "Number", "Email", "Trip Details", "Page"];

function doPost(e) {
  var sheet = getOrCreateSheet_();
  var payload = e && e.parameter ? e.parameter : {};

  sheet.appendRow([
    new Date(),
    payload.name || "",
    payload.number || "",
    payload.email || "",
    payload.tripDetails || "",
    payload.page || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }

  return sheet;
}
