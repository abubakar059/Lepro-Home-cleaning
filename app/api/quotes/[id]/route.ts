import { NextResponse } from "next/server"
import { updateQuoteStatus, deleteQuote, ensureIndexes } from "@/lib/mongodb-models"
import type { QuoteStatus } from "@/lib/types"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = (await req.json()) as { status: QuoteStatus }

    if (!["pending", "reviewed", "contacted"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await updateQuoteStatus(params.id, status)

    if (!updated) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    return NextResponse.json({ quote: updated })
  } catch (error) {
    console.error("Error updating quote:", error)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await ensureIndexes()

    const deleted = await deleteQuote(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Quote deleted" })
  } catch (error) {
    console.error("Error deleting quote:", error)
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 })
  }
}
