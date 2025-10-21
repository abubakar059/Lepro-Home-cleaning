import { NextResponse } from "next/server"
import { quoteStore } from "@/lib/quotes-store"
import type { Quote } from "@/lib/types"

export async function GET() {
  const items = quoteStore.list()
  return NextResponse.json({ quotes: items })
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

    const created = quoteStore.add({
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
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
