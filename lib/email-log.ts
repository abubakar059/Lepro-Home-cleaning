// This file is no longer used. All email log operations should use lib/mongodb-models.ts instead.

export type EmailLogEntry = {
  id: string
  to: string
  subject: string
  html: string
  createdAt: string
  sent: boolean
  error?: string
}

type EmailLogStore = {
  entries: EmailLogEntry[]
  add: (entry: Omit<EmailLogEntry, "id" | "createdAt">) => EmailLogEntry
  list: () => EmailLogEntry[]
  clear: () => void
}

const globalForEmailLog = globalThis as unknown as { __emailLogStore?: EmailLogStore }

function createEmailLogStore(): EmailLogStore {
  const entries: EmailLogEntry[] = []
  return {
    entries,
    add(input) {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2)
      const createdAt = new Date().toISOString()
      const entry: EmailLogEntry = { id, createdAt, ...input }
      entries.unshift(entry)
      return entry
    },
    list() {
      return entries
    },
    clear() {
      entries.splice(0, entries.length)
    },
  }
}

export const emailLogStore =
  globalForEmailLog.__emailLogStore ?? (globalForEmailLog.__emailLogStore = createEmailLogStore())
