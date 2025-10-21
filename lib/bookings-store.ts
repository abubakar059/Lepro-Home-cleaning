// This file is no longer used. All booking operations should use lib/mongodb-models.ts instead.

import type { Booking, BookingStatus } from "./types"

type Store = {
  bookings: Booking[]
  add: (input: Omit<Booking, "id" | "createdAt" | "status">) => Booking
  list: () => Booking[]
  updateStatus: (id: string, status: BookingStatus) => Booking | undefined
}

const globalForBookings = globalThis as unknown as { __bookingStore?: Store }

function createStore(): Store {
  const bookings: Booking[] = []

  return {
    bookings,
    add(input) {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2)
      const createdAt = new Date().toISOString()
      const booking: Booking = { id, createdAt, status: "pending", ...input }
      bookings.unshift(booking)
      return booking
    },
    list() {
      return bookings
    },
    updateStatus(id, status) {
      const idx = bookings.findIndex((b) => b.id === id)
      if (idx === -1) return undefined
      bookings[idx] = { ...bookings[idx], status }
      return bookings[idx]
    },
  }
}

export const bookingStore = globalForBookings.__bookingStore ?? (globalForBookings.__bookingStore = createStore())
