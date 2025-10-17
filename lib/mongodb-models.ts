import { ObjectId } from "mongodb"
import { getDatabase, ensureIndexes } from "./db"
import type { Booking, BookingStatus, EmailLogEntry } from "./types"

// ============ BOOKINGS COLLECTION ============

export async function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status">
): Promise<Booking> {
  const db = await getDatabase()
  const collection = db.collection("bookings")

  const booking = {
    _id: new ObjectId(),
    ...input,
    createdAt: new Date().toISOString(),
    status: "pending" as BookingStatus,
  }

  await collection.insertOne(booking)

  return {
    id: booking._id.toString(),
    ...booking,
  } as Booking
}

export async function getBookings(): Promise<Booking[]> {
  const db = await getDatabase()
  const collection = db.collection("bookings")

  const bookings = await collection.find({}).sort({ createdAt: -1 }).toArray()

  return bookings.map((b: any) => ({
    id: b._id.toString(),
    name: b.name,
    email: b.email,
    phone: b.phone,
    date: b.date,
    time: b.time,
    whatsapp: b.whatsapp,
    createdAt: b.createdAt,
    status: b.status,
    service: b.service,
    location: b.location,
  }))
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const db = await getDatabase()
  const collection = db.collection("bookings")

  try {
    const booking = await collection.findOne({ _id: new ObjectId(id) })
    if (!booking) return null

    return {
      id: booking._id.toString(),
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      whatsapp: booking.whatsapp,
      createdAt: booking.createdAt,
      status: booking.status,
      service: booking.service,
      location: booking.location,
    }
  } catch {
    return null
  }
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | null> {
  const db = await getDatabase()
  const collection = db.collection("bookings")

  try {
    // ✅ Correct ObjectId usage here
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    )
    if (!result) return null

    const booking = result
    return {
      id: booking._id.toString(),
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      time: booking.time,
      whatsapp: booking.whatsapp,
      createdAt: booking.createdAt,
      status: booking.status,
      service: booking.service,
      location: booking.location,
    }
  } catch (err) {
    console.error("Update failed:", err)
    return null
  }
}

// ============ EMAIL LOG COLLECTION ============

export async function createEmailLog(
  input: Omit<EmailLogEntry, "id" | "createdAt">
): Promise<EmailLogEntry> {
  const db = await getDatabase()
  const collection = db.collection("email_logs")

  const entry = {
    _id: new ObjectId(),
    ...input,
    createdAt: new Date().toISOString(),
  }

  await collection.insertOne(entry)

  return {
    id: entry._id.toString(),
    ...entry,
  } as EmailLogEntry
}

export async function getEmailLogs(): Promise<EmailLogEntry[]> {
  const db = await getDatabase()
  const collection = db.collection("email_logs")

  const logs = await collection.find({}).sort({ createdAt: -1 }).toArray()

  return logs.map((log: any) => ({
    id: log._id.toString(),
    to: log.to,
    subject: log.subject,
    html: log.html,
    createdAt: log.createdAt,
    sent: log.sent,
    error: log.error,
  }))
}

export async function clearEmailLogs(): Promise<void> {
  const db = await getDatabase()
  const collection = db.collection("email_logs")
  await collection.deleteMany({})
}

// Re-export ensureIndexes for convenience
export { ensureIndexes }
