import { NextResponse } from "next/server"
import { createQuote, getQuotes, ensureIndexes } from "@/lib/mongodb-models"
import type { Quote } from "@/lib/types"

export async function GET() {
  try {
    await ensureIndexes()
    const quotes = await getQuotes()
    return NextResponse.json({ quotes })
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Partial<Quote>
    const {
      name,
      email,
      phone,
      address,
      serviceArea,
      serviceType,
      propertyType,
      squareFootage,
      adults,
      kids,
      pets,
      serviceLevel,
      kitchens,
      fullBathrooms,
      halfBathrooms,
      walkInShowers,
      largeOvalTubs,
      doubleSinks,
      basement,
      dusting,
      comments,
    } = data

    if (!email || !serviceArea || !adults || !serviceLevel || !squareFootage) {
      return NextResponse.json(
        { error: "Missing required fields: email, serviceArea, adults, serviceLevel, squareFootage" },
        { status: 400 },
      )
    }

    const created = await createQuote({
      name: name ?? "",
      email,
      phone: phone ?? "",
      address: address ?? "",
      serviceArea,
      serviceType: serviceType ?? "",
      propertyType: propertyType ?? "",
      squareFootage,
      adults,
      kids: kids ?? "",
      pets: pets ?? "",
      serviceLevel,
      kitchens: kitchens ?? "",
      fullBathrooms: fullBathrooms ?? "",
      halfBathrooms: halfBathrooms ?? "",
      walkInShowers: walkInShowers ?? "",
      largeOvalTubs: largeOvalTubs ?? "",
      doubleSinks: doubleSinks ?? "",
      basement: basement ?? "",
      dusting: dusting ?? "",
      comments: comments ?? "",
    })

    return NextResponse.json({ quote: created }, { status: 201 })
  } catch (error) {
    console.error("Error creating quote:", error)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
