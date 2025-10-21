import { ObjectId } from "mongodb"
import { getDatabase, ensureIndexes } from "./db"
import type { Booking, BookingStatus, EmailLogEntry, Quote, QuoteStatus } from "./types"

// ============ BOOKINGS COLLECTION ============

export async function createBooking(input: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> {
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
    paymentMethod: b.paymentMethod,
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
      paymentMethod: booking.paymentMethod,
    }
  } catch {
    return null
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const db = await getDatabase()
  const collection = db.collection("bookings")

  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" },
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
      paymentMethod: booking.paymentMethod,
    }
  } catch (err) {
    console.error("Update failed:", err)
    return null
  }
}

export async function deleteBooking(id: string): Promise<boolean> {
  const db = await getDatabase()
  const collection = db.collection("bookings")

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (err) {
    console.error("Delete failed:", err)
    return false
  }
}

// ============ QUOTES COLLECTION ============

export async function createQuote(input: Omit<Quote, "id" | "createdAt" | "status">): Promise<Quote> {
  const db = await getDatabase()
  const collection = db.collection("quotes")

  const quote = {
    _id: new ObjectId(),
    ...input,
    createdAt: new Date().toISOString(),
    status: "pending" as QuoteStatus,
  }

  await collection.insertOne(quote)

  return {
    id: quote._id.toString(),
    ...quote,
  } as Quote
}

export async function getQuotes(): Promise<Quote[]> {
  const db = await getDatabase()
  const collection = db.collection("quotes")

  const quotes = await collection.find({}).sort({ createdAt: -1 }).toArray()

  return quotes.map((q: any) => ({
    id: q._id.toString(),
    name: q.name,
    email: q.email,
    phone: q.phone,
    address: q.address,
    serviceArea: q.serviceArea,
    serviceType: q.serviceType,
    propertyType: q.propertyType,
    squareFootage: q.squareFootage,
    adults: q.adults,
    kids: q.kids,
    pets: q.pets,
    serviceLevel: q.serviceLevel,
    kitchens: q.kitchens,
    fullBathrooms: q.fullBathrooms,
    halfBathrooms: q.halfBathrooms,
    walkInShowers: q.walkInShowers,
    largeOvalTubs: q.largeOvalTubs,
    doubleSinks: q.doubleSinks,
    basement: q.basement,
    dusting: q.dusting,
    comments: q.comments,
    createdAt: q.createdAt,
    status: q.status,
  }))
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const db = await getDatabase()
  const collection = db.collection("quotes")

  try {
    const quote = await collection.findOne({ _id: new ObjectId(id) })
    if (!quote) return null

    return {
      id: quote._id.toString(),
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      address: quote.address,
      serviceArea: quote.serviceArea,
      serviceType: quote.serviceType,
      propertyType: quote.propertyType,
      squareFootage: quote.squareFootage,
      adults: quote.adults,
      kids: quote.kids,
      pets: quote.pets,
      serviceLevel: quote.serviceLevel,
      kitchens: quote.kitchens,
      fullBathrooms: quote.fullBathrooms,
      halfBathrooms: quote.halfBathrooms,
      walkInShowers: quote.walkInShowers,
      largeOvalTubs: quote.largeOvalTubs,
      doubleSinks: quote.doubleSinks,
      basement: quote.basement,
      dusting: quote.dusting,
      comments: quote.comments,
      createdAt: quote.createdAt,
      status: quote.status,
    }
  } catch {
    return null
  }
}

export async function updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | null> {
  const db = await getDatabase()
  const collection = db.collection("quotes")

  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" },
    )
    if (!result) return null

    const quote = result
    return {
      id: quote._id.toString(),
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      address: quote.address,
      serviceArea: quote.serviceArea,
      serviceType: quote.serviceType,
      propertyType: quote.propertyType,
      squareFootage: quote.squareFootage,
      adults: quote.adults,
      kids: quote.kids,
      pets: quote.pets,
      serviceLevel: quote.serviceLevel,
      kitchens: quote.kitchens,
      fullBathrooms: quote.fullBathrooms,
      halfBathrooms: quote.halfBathrooms,
      walkInShowers: quote.walkInShowers,
      largeOvalTubs: quote.largeOvalTubs,
      doubleSinks: quote.doubleSinks,
      basement: quote.basement,
      dusting: quote.dusting,
      comments: quote.comments,
      createdAt: quote.createdAt,
      status: quote.status,
    }
  } catch (err) {
    console.error("Update failed:", err)
    return null
  }
}

export async function deleteQuote(id: string): Promise<boolean> {
  const db = await getDatabase()
  const collection = db.collection("quotes")

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch (err) {
    console.error("Delete failed:", err)
    return false
  }
}

// ============ EMAIL LOG COLLECTION ============

export async function createEmailLog(input: Omit<EmailLogEntry, "id" | "createdAt">): Promise<EmailLogEntry> {
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
