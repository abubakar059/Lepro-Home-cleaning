import { NextResponse } from "next/server"
import { updateBookingStatus, ensureIndexes } from "@/lib/mongodb-models"
import type { BookingStatus } from "@/lib/types"
import { sendCustomerStatusEmail } from "@/lib/email"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await ensureIndexes()
    const body = (await req.json()) as { status?: BookingStatus }
    if (!body?.status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 })
    }
    if (!["pending", "accepted", "cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await updateBookingStatus(params.id, body.status)
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Fire-and-forget status email to customer
    sendCustomerStatusEmail({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      date: updated.date,
      time: updated.time,
      status: updated.status,
      service: updated.service,
      location: updated.location,
    }).catch(() => {})

    return NextResponse.json({ booking: updated })
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Invalid JSON or database error" }, { status: 400 })
  }
}
