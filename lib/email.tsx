import nodemailer from "nodemailer"
import { createEmailLog, ensureIndexes } from "./mongodb-models"

type EmailPayload = {
  to: string | string[]
  subject: string
  html: string
}

const FROM_EMAIL = "admin@leprohomeservices.ca"
const ADMIN_EMAIL = "admin@leprohomeservices.ca,george@leprohomeservices.ca"

// Nodemailer SMTP configuration
const SMTP_HOST = "smtp.hostinger.com"
const SMTP_PORT = 587
const SMTP_USER = "admin@leprohomeservices.ca"
const SMTP_PASS = "Adminleprohom1@"
const SMTP_SECURE = false

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  }

  return transporter
}

async function sendEmail({ to, subject, html }: EmailPayload) {
  const transport = getTransporter()
  const toStr = Array.isArray(to) ? to.join(", ") : to

  try {
    await ensureIndexes()
  } catch (err) {
    console.error("[v0] Failed to ensure indexes:", err)
  }

  if (!transport) {
    // Log the "would send" email for visibility in the admin dashboard
    try {
      await createEmailLog({
        to: toStr,
        subject,
        html,
        sent: false,
        error: "Missing SMTP configuration (SMTP_HOST, SMTP_USER, or SMTP_PASS)",
      })
    } catch (err) {
      console.error("[v0] Failed to log email:", err)
    }
    console.log("[v0] Missing SMTP configuration; email not sent:", { to, subject })
    return
  }

  try {
    const info = await transport.sendMail({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    await createEmailLog({
      to: toStr,
      subject,
      html,
      sent: true,
    })
    console.log("[v0] Email sent successfully:", info.messageId)
  } catch (err: any) {
    try {
      await createEmailLog({
        to: toStr,
        subject,
        html,
        sent: false,
        error: err?.message || "Unknown error",
      })
    } catch (logErr) {
      console.error("[v0] Failed to log email error:", logErr)
    }
    console.log("[v0] Email send failed:", err?.message || err)
  }
}

export async function sendAdminNewBookingEmail(booking: {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  service?: string
  location?: string
}) {
  if (!ADMIN_EMAIL) {
    console.log("[v0] Missing ADMIN_EMAIL; admin notification skipped for booking", booking.id)
    return
  }

  // ✅ Support multiple admin emails separated by commas
  const adminEmails = ADMIN_EMAIL.split(",").map((e) => e.trim())

  const subject = `New Booking Request from ${booking.name} (${booking.date} ${booking.time})`
  const html = `
    <div style="font-family:system-ui,Segoe UI,Helvetica,Arial,sans-serif;padding:16px">
      <h2 style="margin:0 0 12px">New Booking Request</h2>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone || "-"}</p>
      <p><strong>Service:</strong> ${booking.service || "-"}</p>
      <p><strong>Location:</strong> ${booking.location || "-"}</p>
      <p><strong>Date/Time:</strong> ${booking.date} ${booking.time}</p>
      <p style="margin-top:16px">Please review and approve this request in the Admin Dashboard:</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin" target="_blank">Open Admin Dashboard</a></p>
      <p style="color:#64748b;font-size:12px;margin-top:12px">Booking ID: ${booking.id}</p>
    </div>
  `

  // ✅ Send to all admins
  await sendEmail({ to: adminEmails, subject, html })
}

export async function sendCustomerStatusEmail(booking: {
  id: string
  name: string
  email: string
  date: string
  time: string
  status: "accepted" | "cancelled" | "pending"
  service?: string
  location?: string
}) {
  if (!booking.email) {
    console.log("[v0] Booking is missing customer email; cannot send status email", booking.id)
    return
  }

  const approved = booking.status === "accepted"
  const subject = approved
    ? "Your Booking is Confirmed"
    : booking.status === "cancelled"
      ? "Your Booking Request was Not Approved"
      : "Your Booking Status Updated"

  const html = `
    <div style="font-family:system-ui,Segoe UI,Helvetica,Arial,sans-serif;padding:16px">
      <h2 style="margin:0 0 12px">${approved ? "Booking Confirmed 🎉" : "Booking Update"}</h2>
      <p>Hello ${booking.name},</p>
      <p>
        ${
          approved
            ? "Great news — your booking has been approved!"
            : booking.status === "cancelled"
              ? "We couldn't approve your booking at this time."
              : "Your booking status has changed."
        }
      </p>
      <p><strong>Service:</strong> ${booking.service || "-"}</p>
      <p><strong>Location:</strong> ${booking.location || "-"}</p>
      <p><strong>Date/Time:</strong> ${booking.date} ${booking.time}</p>
      <p style="margin-top:16px">
        ${approved ? "We look forward to serving you!" : "Feel free to contact us to reschedule or ask questions."}
      </p>
      <p style="color:#64748b;font-size:12px;margin-top:12px">Booking ID: ${booking.id}</p>
    </div>
  `

  await sendEmail({ to: booking.email, subject, html })
}
