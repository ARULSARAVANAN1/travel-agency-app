const SHEET_NAME = "Travel Requests";
const HEADERS = ["Submitted At", "Name", "Number", "Email", "Trip Details"];
const NOTIFICATION_EMAIL = "thilagamanitours.travels@gmail.com";
const SPREADSHEET_ID = "1LUbHFERpWwWRHocxrdY-AOTjPM1YRyaWMQX8uQekQdQ";

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
    payload.tripDetails || ""
  ]);

  // Styling for new row
  sheet.autoResizeColumns(1, HEADERS.length);

  var lastRow = sheet.getLastRow();
  var rowRange = sheet.getRange(lastRow, 1, 1, HEADERS.length);

  rowRange.setBorder(true, true, true, true, false, false);
  rowRange.setHorizontalAlignment("left");

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: "New Travel Request - Thilagamani Tours and Travels",
    htmlBody: buildEmailBody_(payload, formattedSubmittedAt)
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  var spreadsheet = getSpreadsheet_();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);

    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);

    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2c3e50");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");

    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getSpreadsheet_() {
  if (
    SPREADSHEET_ID &&
    SPREADSHEET_ID !== "PASTE_TARGET_SPREADSHEET_ID_HERE"
  ) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error(
      "No active spreadsheet found. Set SPREADSHEET_ID in Code.gs."
    );
  }

  return spreadsheet;
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
    if (!pair) return result;

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
    "dd/MM/yyyy hh:mm:ss a"
  );
}

function buildEmailBody_(payload, submittedAt) {

  var sheetLink = "https://docs.google.com/spreadsheets/d/1LUbHFERpWwWRHocxrdY-AOTjPM1YRyaWMQX8uQekQdQ/edit?usp=sharing";

  return `
  <div style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      
      <h2 style="color:#2c3e50;">🚌 New Travel Request</h2>

      <p style="color:#555;">
        A new enquiry has been submitted on your website.
      </p>

      <table style="width:100%; border-collapse:collapse; margin-top:20px;">

        <tr>
          <td style="padding:10px; font-weight:bold;">Submitted At</td>
          <td style="padding:10px;">${submittedAt}</td>
        </tr>

        <tr style="background:#f9f9f9;">
          <td style="padding:10px; font-weight:bold;">Name</td>
          <td style="padding:10px;">${payload.name || ""}</td>
        </tr>

        <tr>
          <td style="padding:10px; font-weight:bold;">Phone Number</td>
          <td style="padding:10px;">${payload.number || ""}</td>
        </tr>

        <tr style="background:#f9f9f9;">
          <td style="padding:10px; font-weight:bold;">Email</td>
          <td style="padding:10px;">${payload.email || "Not provided"}</td>
        </tr>

        <tr>
          <td style="padding:10px; font-weight:bold;">Trip Details</td>
          <td style="padding:10px;">${payload.tripDetails || ""}</td>
        </tr>

      </table>

      <div style="text-align:center; margin-top:25px;">
        <a href="${sheetLink}" 
           style="background:#3498db; color:white; padding:10px 18px; text-decoration:none; border-radius:6px; font-weight:bold;">
           📄 View All Travel Requests
        </a>
      </div>

      <hr style="margin:25px 0;">

      <p style="font-size:12px; color:#888;">
        Thilagamani Tours & Travels – Website Enquiry Notification
      </p>

    </div>

  </div>
  `;
}