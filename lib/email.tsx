type EmailPayload = {
  to: string | string[]
  subject: string
  html: string
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || "LePro Home Services <noreply@example.com>"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

import { emailLogStore } from "./email-log"

async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!RESEND_API_KEY) {
    // Log the "would send" email for visibility in the admin dashboard
    emailLogStore.add({ to: Array.isArray(to) ? to.join(", ") : to, subject, html, sent: false, error: "Missing RESEND_API_KEY" })
    console.log("[v0] Missing RESEND_API_KEY; email not sent:", { to, subject })
    return
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to], // ✅ support multiple recipients
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      emailLogStore.add({ to: Array.isArray(to) ? to.join(", ") : to, subject, html, sent: false, error: `Resend ${res.status}: ${body}` })
      console.log("[v0] Resend error", res.status, body)
    } else {
      emailLogStore.add({ to: Array.isArray(to) ? to.join(", ") : to, subject, html, sent: true })
    }
  } catch (err: any) {
    emailLogStore.add({ to: Array.isArray(to) ? to.join(", ") : to, subject, html, sent: false, error: err?.message || "Unknown error" })
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
  const adminEmails = ADMIN_EMAIL.split(",").map(e => e.trim())

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
