import type { Quote, QuoteStatus } from "./types"

type Store = {
  quotes: Quote[]
  add: (input: Omit<Quote, "id" | "createdAt" | "status">) => Quote
  list: () => Quote[]
  updateStatus: (id: string, status: QuoteStatus) => Quote | undefined
}

const globalForQuotes = globalThis as unknown as { __quoteStore?: Store }

function createStore(): Store {
  const quotes: Quote[] = []

  return {
    quotes,
    add(input) {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2)
      const createdAt = new Date().toISOString()
      const quote: Quote = { id, createdAt, status: "pending", ...input }
      quotes.unshift(quote)
      return quote
    },
    list() {
      return quotes
    },
    updateStatus(id, status) {
      const idx = quotes.findIndex((q) => q.id === id)
      if (idx === -1) return undefined
      quotes[idx] = { ...quotes[idx], status }
      return quotes[idx]
    },
  }
}

export const quoteStore = globalForQuotes.__quoteStore ?? (globalForQuotes.__quoteStore = createStore())
