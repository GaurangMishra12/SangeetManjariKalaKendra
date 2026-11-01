/**
 * Sangeet Manjari Kala Kendra – enquiry form receiver
 *
 * Saves every website enquiry as a new row in this Google Sheet
 * and emails it to you. Setup steps: see FORM-SETUP.md
 */

// ▼▼ Change this to the email address that should receive enquiries ▼▼
const NOTIFY_EMAIL = "your-email@gmail.com";
// ▲▲▲

const HEADERS = ["Date & time", "Name", "Phone", "Class mode", "Course", "Message", "Form", "Page"];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Ignore bots (they fill the hidden "website" field) and empty submissions
  if (p.website || !p.name || !p.phone) return ok();

  const clean = (v) => String(v || "").slice(0, 2000).replace(/^[=+\-@]/, "'$&"); // stop spreadsheet formulas
  const row = [
    new Date(),
    clean(p.name), clean(p.phone), clean(p.mode), clean(p.course),
    clean(p.message), clean(p.source), clean(p.page),
  ];

  // 1) save to the sheet
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  // 2) email it
  if (NOTIFY_EMAIL && NOTIFY_EMAIL.indexOf("@") > 0 && NOTIFY_EMAIL !== "your-email@gmail.com") {
    const lines = HEADERS.map((h, i) => h + ": " + (i === 0 ? Utilities.formatDate(row[0], "Asia/Kolkata", "dd MMM yyyy, hh:mm a") : row[i] || "-"));
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "New enquiry: " + row[1] + (row[4] ? " – " + row[4] : ""),
      body: "New enquiry from the Sangeet Manjari website\n\n" + lines.join("\n") +
            "\n\nAll enquiries: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    });
  }

  return ok();
}

// Lets you check the web app URL in a browser
function doGet() {
  return ContentService.createTextOutput("Sangeet Manjari enquiry form is running.");
}

function ok() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
