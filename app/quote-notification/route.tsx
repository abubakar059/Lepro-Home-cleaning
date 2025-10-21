import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// ✅ Validate the incoming quote data
function validateQuoteData(formData: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push("Valid email address is required")
  }

  if (!formData.serviceArea) errors.push("Service area is required")
  if (!formData.adults) errors.push("Number of adults is required")
  if (formData.kids === undefined) errors.push("Number of kids is required")
  if (formData.pets === undefined) errors.push("Number of pets is required")
  if (!formData.serviceLevel) errors.push("Service level is required")
  if (!formData.squareFootage) errors.push("Square footage is required")

  return {
    valid: errors.length === 0,
    errors,
  }
}

// ✅ Generate the admin email HTML
function generateEmailHTML(formData: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .section { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-left: 4px solid #0ea5e9; border-radius: 4px; }
          .label { font-weight: bold; color: #0369a1; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Quote Request</h1>
            <p>Lepro Home Services</p>
          </div>

          <div class="section">
            <h3>Contact Information</h3>
            <p><span class="label">Name:</span> ${formData.name || "Not provided"}</p>
            <p><span class="label">Email:</span> ${formData.email}</p>
            <p><span class="label">Phone:</span> ${formData.phone || "Not provided"}</p>
            <p><span class="label">Address:</span> ${formData.address || "Not provided"}</p>
            <p><span class="label">Service Area:</span> ${formData.serviceArea}</p>
          </div>

          <div class="section">
            <h3>Family Information</h3>
            <p><span class="label">Adults:</span> ${formData.adults}</p>
            <p><span class="label">Kids:</span> ${formData.kids}</p>
            <p><span class="label">Pets:</span> ${formData.pets}</p>
          </div>

          <div class="section">
            <h3>Property Details</h3>
            <p><span class="label">Service Level:</span> ${formData.serviceLevel}</p>
            <p><span class="label">Square Footage:</span> ${formData.squareFootage}</p>
            <p><span class="label">Kitchens:</span> ${formData.kitchens || "N/A"}</p>
            <p><span class="label">Full Bathrooms:</span> ${formData.fullBathrooms || "N/A"}</p>
            <p><span class="label">Half Bathrooms:</span> ${formData.halfBathrooms || "N/A"}</p>
            <p><span class="label">Walk In Showers:</span> ${formData.walkInShowers || "N/A"}</p>
            <p><span class="label">Large Oval Tubs:</span> ${formData.largeOvalTubs || "N/A"}</p>
            <p><span class="label">Double Sinks:</span> ${formData.doubleSinks || "N/A"}</p>
            <p><span class="label">Basement:</span> ${formData.basement || "N/A"}</p>
            <p><span class="label">Dusting:</span> ${formData.dusting || "N/A"}</p>
          </div>

          ${
            formData.comments
              ? `<div class="section"><h3>Additional Comments</h3><p>${formData.comments}</p></div>`
              : ""
          }

          <div class="footer">
            <p>This is an automated message from the Lepro Home Services quote form.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// ✅ Handle the POST request
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    const validation = validateQuoteData(formData)

    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 })
    }

    // ✅ Create the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // ✅ Send admin email
    await transporter.sendMail({
      from: `"Lepro Home Services" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || "admin@leprohomeservices.ca",
      subject: `New Quote Request from ${formData.name || formData.email}`,
      html: generateEmailHTML(formData),
    })

    // ✅ Send confirmation email to customer
    await transporter.sendMail({
      from: `"Lepro Home Services" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: "Quote Request Received - Lepro Home Services",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #0369a1;">Quote Request Received</h2>
          <p>Hi ${formData.name || "there"},</p>
          <p>Thank you for requesting a quote from Lepro Home Services! Our team will contact you within 24 hours.</p>
          <p>For questions, contact us at <a href="mailto:admin@leprohomeservices.ca">admin@leprohomeservices.ca</a>.</p>
          <p><strong>Lepro Home Services Team</strong></p>
        </div>
      `,
    })

    console.log("[v0] Quote submitted successfully from:", formData.email)
    return NextResponse.json({ success: true, message: "Quote submitted successfully" })
  } catch (error) {
    console.error("[v0] Quote submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
