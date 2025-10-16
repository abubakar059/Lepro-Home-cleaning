import { NextResponse } from "next/server"
import { emailLogStore } from "@/lib/email-log"

export async function GET() {
  return NextResponse.json({ emails: emailLogStore.list() })
}

export async function DELETE() {
  emailLogStore.clear()
  return NextResponse.json({ ok: true })
}
