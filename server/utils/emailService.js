// emailService.js
// Sits alongside your existing sendEmail.js — just requires it.
// Usage in bookings route:
//   const { sendApprovalEmail, sendRejectionEmail } = require('./emailService');

const sendEmail = require('./sendEmail'); // adjust path if needed

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── HTML email wrapper ──────────────────────────────────────────────────────
function wrapEmail(content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f5f0ea;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0ea;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#c0623a;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:1px;font-family:Georgia,serif;">
                Clay in a Tray
              </h1>
              <p style="margin:6px 0 0;color:#f5ddd7;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
                South Golden Beach · Byron Bay
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#faf8f5;padding:24px 40px;border-top:1px solid #ebe3db;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;line-height:1.8;">
                Clay in a Tray · South Golden Beach, Byron Bay, NSW<br/>
                Questions? Simply reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Approval email ──────────────────────────────────────────────────────────
async function sendApprovalEmail(toEmail, { guestName, propertyName, checkIn, checkOut, guests, totalNights, totalPrice }) {
  const safeGuestName = escapeHtml(guestName);
  const safePropertyName = escapeHtml(propertyName);
  const safeCheckIn = escapeHtml(checkIn);
  const safeCheckOut = escapeHtml(checkOut);
  const safeGuests = escapeHtml(guests);
  const safeTotalNights = Number(totalNights || 0);
  const safeTotalPrice = escapeHtml(totalPrice);
  const subject = `Booking Confirmed - ${propertyName}`;

  const html = wrapEmail(`
    <h2 style="margin:0 0 8px;color:#2c2c2c;font-size:22px;">Booking Confirmed! 🎉</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;">We're so excited to welcome you to South Golden Beach.</p>

    <p style="font-size:15px;color:#2c2c2c;line-height:1.7;margin:0 0 20px;">
      Hi <strong>${safeGuestName}</strong>,<br/><br/>
      Great news — your booking has been <strong style="color:#2a9d2a;">approved!</strong>
      Here are your confirmed details:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0"
           style="background:#faf8f5;border-radius:12px;padding:20px;border:1px solid #ebe3db;margin-bottom:24px;">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;">
          <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Property</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;text-align:right;">
          <strong style="color:#2c2c2c;font-size:14px;">${safePropertyName}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;">
          <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Check-in</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;text-align:right;">
          <strong style="color:#2c2c2c;font-size:14px;">${safeCheckIn}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;">
          <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Check-out</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;text-align:right;">
          <strong style="color:#2c2c2c;font-size:14px;">${safeCheckOut}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;">
          <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Guests</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;text-align:right;">
          <strong style="color:#2c2c2c;font-size:14px;">${safeGuests}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;">
          <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Duration</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #ebe3db;text-align:right;">
          <strong style="color:#2c2c2c;font-size:14px;">${safeTotalNights} night${safeTotalNights !== 1 ? 's' : ''}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0 0;">
          <span style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Total</span>
        </td>
        <td style="padding:10px 0 0;text-align:right;">
          <strong style="color:#c0623a;font-size:20px;">$${safeTotalPrice}</strong>
        </td>
      </tr>
    </table>

    <p style="font-size:15px;color:#2c2c2c;line-height:1.7;margin:0 0 24px;">
      🏖️ A welcome guide with entry instructions, Wi-Fi details, and local tips will be waiting for you at the property.
      If you have any questions before your stay, just reply to this email!
    </p>

    <div style="text-align:center;">
      <a href="https://maps.app.goo.gl/dJmUuG5DVrSCeSfu7"
         style="display:inline-block;background:#c0623a;color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:8px;font-size:15px;font-weight:bold;">
        📍 View on Google Maps
      </a>
    </div>
  `);

  // sendEmail(to, subject, text) — pass html as the text arg since your function
  // sends it as `text`. To send proper HTML, we call transporter directly below.
  // If you want to upgrade sendEmail to support HTML, see the note at the bottom.
  await sendEmailHtml(toEmail, subject, html);
}

// ── Rejection email ─────────────────────────────────────────────────────────
async function sendRejectionEmail(toEmail, { guestName, propertyName, checkIn, checkOut, reason }) {
  const safeGuestName = escapeHtml(guestName);
  const safePropertyName = escapeHtml(propertyName);
  const safeCheckIn = escapeHtml(checkIn);
  const safeCheckOut = escapeHtml(checkOut);
  const safeReason = escapeHtml(reason);
  const subject = `Your Booking Request - ${propertyName}`;

  const html = wrapEmail(`
    <h2 style="margin:0 0 8px;color:#2c2c2c;font-size:22px;">Booking Update</h2>
    <p style="margin:0 0 24px;color:#888;font-size:14px;">Regarding your stay at South Golden Beach.</p>

    <p style="font-size:15px;color:#2c2c2c;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${safeGuestName}</strong>,<br/><br/>
      We're sorry — we're unable to accommodate your booking for
      <strong>${safePropertyName}</strong> (${safeCheckIn} → ${safeCheckOut}) at this time.
    </p>

    ${reason ? `
    <div style="background:#fff5f2;border-left:4px solid #c0623a;padding:14px 18px;
                border-radius:0 8px 8px 0;margin-bottom:20px;">
      <p style="margin:0;font-size:14px;color:#2c2c2c;line-height:1.6;">
        <strong>Reason:</strong> ${safeReason}
      </p>
    </div>` : ''}

    <p style="font-size:15px;color:#2c2c2c;line-height:1.7;margin:0 0 24px;">
      We'd love to host you another time — please check availability for alternative dates.
      Just reply to this email if you'd like help finding a good time.
    </p>

    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/accommodation"
         style="display:inline-block;background:#c0623a;color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:8px;font-size:15px;font-weight:bold;">
        🔍 Browse Available Dates
      </a>
    </div>
  `);

  await sendEmailHtml(toEmail, subject, html);
}

// ── Internal helper: send HTML email using the same Gmail credentials ───────
// Your existing sendEmail only sends plain `text`. This adds `html` support
// without changing your original file.
const nodemailer = require('nodemailer');

async function sendEmailHtml(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Clay In A Tray" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    // plain-text fallback for email clients that block HTML
    text: `Hi, please view this email in an HTML-capable client for full formatting.`,
  });
}

module.exports = { sendApprovalEmail, sendRejectionEmail };
