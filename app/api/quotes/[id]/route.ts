import { NextResponse } from "next/server"
import { quoteStore } from "@/lib/quotes-store"
import type { QuoteStatus } from "@/lib/types"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = (await req.json()) as { status: QuoteStatus }

    if (!["pending", "reviewed", "contacted"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = quoteStore.updateStatus(params.id, status)

    if (!updated) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    return NextResponse.json({ quote: updated })
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
