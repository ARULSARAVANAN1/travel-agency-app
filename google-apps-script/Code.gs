const SHEET_NAME = "Travel Requests";
const HEADERS = ["Submitted At", "Name", "Number", "Email", "Trip Details"];
const NOTIFICATION_EMAIL = "saravansnp@gmail.com";

function doPost(e) {
  var sheet = getOrCreateSheet_();
  var payload = getPayload_(e);
  var submittedAt = new Date();
  var formattedSubmittedAt = formatSubmittedAt_(submittedAt);

  sheet.appendRow([
    formattedSubmittedAt,
    payload.name || "",
    payload.number || "",
    payload.email || "",
    payload.tripDetails || "",
  ]);

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: "New Travel Request - Thilagamani Tours and Travels",
    body: buildEmailBody_(payload, formattedSubmittedAt)
  });

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

function getPayload_(e) {
  var payload = e && e.parameter ? e.parameter : {};

  if (payload && Object.keys(payload).length > 0) {
    return payload;
  }

  var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : "";

  if (!rawBody) {
    return {};
  }

  return rawBody.split("&").reduce(function (result, pair) {
    if (!pair) {
      return result;
    }

    var parts = pair.split("=");
    var key = decodeURIComponent((parts[0] || "").replace(/\+/g, " "));
    var value = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));

    result[key] = value;
    return result;
  }, {});
}

function formatSubmittedAt_(submittedAt) {
  return Utilities.formatDate(
    submittedAt,
    Session.getScriptTimeZone(),
    "dd:MM:yyyy hh:mm:ss a"
  );
}

function buildEmailBody_(payload, submittedAt) {
  return [
    "A new travel request was submitted.",
    "",
    "Submitted At: " + submittedAt,
    "Name: " + (payload.name || ""),
    "Number: " + (payload.number || ""),
    "Email: " + (payload.email || "Not provided"),
    "Trip Details: " + (payload.tripDetails || ""),
  ].join("\n");
}
