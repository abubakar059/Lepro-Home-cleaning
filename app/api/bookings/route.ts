import { NextResponse } from "next/server"
import { createBooking, getBookings, ensureIndexes } from "@/lib/mongodb-models"
import type { Booking } from "@/lib/types"
import { sendAdminNewBookingEmail } from "@/lib/email"

export async function GET() {
  try {
    await ensureIndexes()
    const bookings = await getBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await ensureIndexes()
    const data = (await req.json()) as Partial<Booking>
    const { name, email, phone, date, time, whatsapp = false, service, location, paymentMethod } = data

    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: "Missing required fields: name, email, date, time" }, { status: 400 })
    }

    const created = await createBooking({
      name,
      email,
      phone: phone ?? "",
      date,
      time,
      whatsapp: Boolean(whatsapp),
      service,
      location,
      paymentMethod: paymentMethod ?? "not-specified",
    })

    // Fire-and-forget admin email (do not block response)
    sendAdminNewBookingEmail({
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      date: created.date,
      time: created.time,
      service: created.service,
      location: created.location,
    }).catch(() => {})

    return NextResponse.json({ booking: created }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Invalid JSON or database error" }, { status: 400 })
  }
}
