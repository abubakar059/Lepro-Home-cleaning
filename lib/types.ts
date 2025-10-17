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
}

export type EmailLogEntry = {
  id: string
  to: string
  subject: string
  html: string
  createdAt: string
  sent: boolean
  error?: string
}
