import { NextResponse } from "next/server"
import { getEmailLogs, clearEmailLogs, ensureIndexes } from "@/lib/mongodb-models"

export async function GET() {
  try {
    await ensureIndexes()
    const emails = await getEmailLogs()
    return NextResponse.json({ emails })
  } catch (error) {
    console.error("Error fetching email logs:", error)
    return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await ensureIndexes()
    await clearEmailLogs()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error clearing email logs:", error)
    return NextResponse.json({ error: "Failed to clear email logs" }, { status: 500 })
  }
}
