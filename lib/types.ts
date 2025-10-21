export type BookingStatus = "pending" | "accepted" | "cancelled"

export interface Booking {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  whatsapp: boolean
  createdAt: string
  status: BookingStatus
  service?: string
  location?: string
  paymentMethod?: string
}

export type QuoteStatus = "pending" | "reviewed" | "contacted"

export interface Quote {
  id: string
  name: string
  email: string
  phone: string
  address: string
  serviceArea: string
  serviceType: string
  propertyType: string
  squareFootage: string
  adults: string
  kids: string
  pets: string
  serviceLevel: string
  kitchens: string
  fullBathrooms: string
  halfBathrooms: string
  walkInShowers: string
  largeOvalTubs: string
  doubleSinks: string
  basement: string
  dusting: string
  comments: string
  createdAt: string
  status: QuoteStatus
}

export interface EmailLogEntry {
  id: string
  to: string
  subject: string
  html: string
  createdAt: string
  sent: boolean
  error?: string
}
