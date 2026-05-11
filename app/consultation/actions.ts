"use server";

import { Resend } from "resend";

export type ConsultationPayload = {
  firstName: string;
  lastName: string;
  serviceInterest: "individual" | "corporate";
  organization: string;
  email: string;
  phone: string;
  message: string;
};

export type ConsultationResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ConsultationPayload, string>> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate(p: ConsultationPayload) {
  const fieldErrors: Partial<Record<keyof ConsultationPayload, string>> = {};
  if (!p.firstName.trim()) fieldErrors.firstName = "First name is required.";
  if (!p.lastName.trim()) fieldErrors.lastName = "Last name is required.";
  if (p.serviceInterest !== "individual" && p.serviceInterest !== "corporate") {
    fieldErrors.serviceInterest = "Please choose a service.";
  }
  if (p.serviceInterest === "corporate" && !p.organization.trim()) {
    fieldErrors.organization = "Organization name is required.";
  }
  if (!p.email.trim()) {
    fieldErrors.email = "Email is required.";
  } else if (!EMAIL_RE.test(p.email.trim())) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  const digits = p.phone.replace(/\D/g, "");
  if (!digits) {
    fieldErrors.phone = "Phone number is required.";
  } else if (digits.length < 7) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }
  return fieldErrors;
}

export async function submitConsultation(
  payload: ConsultationPayload,
): Promise<ConsultationResult> {
  const fieldErrors = validate(payload);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please correct the highlighted fields.", fieldErrors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[consultation] RESEND_API_KEY missing");
    return {
      ok: false,
      error: "Email delivery is not configured yet. Please reach out directly to JLGarrahan@wholara.org.",
    };
  }

  const from = process.env.RESEND_FROM_EMAIL || "Wholara <contact@wholara.org>";
  const to = process.env.CONSULTATION_TO_EMAIL || "JLGarrahan@wholara.org";

  const serviceLabel =
    payload.serviceInterest === "corporate" ? "Corporate Wellness" : "Individual Coaching";

  const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`;
  const subject = `New Wholara Inquiry — ${fullName}`;

  const rows: Array<[string, string]> = [
    ["Name", fullName],
    ["Service Interest", serviceLabel],
  ];
  if (payload.serviceInterest === "corporate") {
    rows.push(["Organization", payload.organization.trim()]);
  }
  rows.push(["Email", payload.email.trim()]);
  rows.push(["Phone", payload.phone.trim()]);
  rows.push(["Message", payload.message.trim() || "(none provided)"]);

  const html = `
<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Arial, sans-serif; background:#F5F0E8; padding:24px; color:#2C4A35;">
    <div style="max-width:560px; margin:0 auto; background:#FFFFFF; border-left:4px solid #C4673A; border-radius:14px; padding:28px;">
      <p style="margin:0 0 4px; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#C4673A;">New consultation inquiry</p>
      <h1 style="margin:0 0 18px; font-size:22px; color:#2C4A35;">${escapeHtml(fullName)}</h1>
      <table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse;">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:10px 0; border-top:1px solid rgba(44,74,53,0.10); vertical-align:top; width:140px; color:rgba(44,74,53,0.65); font-size:12px; text-transform:uppercase; letter-spacing:0.08em;">${escapeHtml(k)}</td>
            <td style="padding:10px 0; border-top:1px solid rgba(44,74,53,0.10); vertical-align:top; color:#2C4A35; font-size:15px; white-space:pre-wrap;">${escapeHtml(v)}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
    <p style="text-align:center; color:rgba(44,74,53,0.55); font-size:11px; margin-top:18px;">Sent from the Wholara consultation form.</p>
  </body>
</html>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.email.trim(),
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[consultation] resend error", error);
      return { ok: false, error: "We couldn't send your inquiry just now. Please try again in a moment." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[consultation] unexpected error", err);
    return { ok: false, error: "Something went wrong on our end. Please try again." };
  }
}
