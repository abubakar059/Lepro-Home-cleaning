"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { services } from "@/lib/services"

// --- Components for Radio Buttons (assuming they are not in the provided imports) ---
// For the purpose of this example, I'll use standard <input type="radio">
// as the `radio` component wasn't provided, but I'll style it with existing classes.
const RadioGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex space-x-4">{children}</div>
)
const RadioItem = ({
  id,
  value,
  checked,
  onChange,
  label,
}: {
  id: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
}) => (
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary/40"
    />
    <Label htmlFor={id}>{label}</Label>
  </div>
)
// ---------------------------------------------------------------------------------

// -------------------------------
// ScheduleForm Component
// -------------------------------
type ScheduleFormProps = {
  onSuccess?: () => void
  onError?: (message: string) => void
}

function ScheduleForm({ onSuccess, onError }: ScheduleFormProps) {
  const { toast } = useToast()
  const search = useSearchParams()
  const prefilledService = search.get("service") ?? ""

  const serviceTitles = useMemo(() => services.map((s) => s.title), [])
  const [service, setService] = useState(prefilledService || serviceTitles[0])
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [useWhatsApp, setUseWhatsApp] = useState(false)
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  // New state for Payment Method
  const [paymentMethod, setPaymentMethod] = useState("Cash") // Default to Cash

  useEffect(() => {
    if (prefilledService && serviceTitles.includes(prefilledService)) {
      setService(prefilledService)
    }
  }, [prefilledService, serviceTitles])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date,
          time,
          location,
          service,
          whatsapp: useWhatsApp,
          // Include new field
          paymentMethod,
        }),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Failed to create booking")
      }

      // ✅ Success popup
      toast({
        title: "Booking Confirmed 🎉",
        description: `Thank you, ${name}! Your ${service} booking for ${date} at ${time} has been received.`,
        duration: 4000,
      })

      onSuccess?.()

      // Clear form
      setName("")
      setDate("")
      setTime("")
      setEmail("")
      setPhone("")
      setLocation("")
      setUseWhatsApp(false)
      setPaymentMethod("Cash") // Reset payment method
    } catch (err: any) {
      const msg = err.message ?? "Please try again."

      // ❌ Failure popup
      toast({
        title: "Booking Failed ❗",
        description: msg,
        variant: "destructive",
        duration: 4000,
      })

      onError?.(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="shadow-lg border border-gray-200 transition hover:shadow-xl hover:border-primary/40">
      <CardContent className="pt-6">
        <form className="grid gap-4" onSubmit={onSubmit}>
          {/* Service selection */}
          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="h-10 rounded-md border bg-transparent px-3 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              aria-label="Choose service"
            >
              {serviceTitles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Date and time - Corrected to ensure proper grid layout */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email for Confirmation</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone (for SMS or WhatsApp)</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+1 555-123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Location */}
          <div className="grid gap-2">
            <Label htmlFor="location">Service Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="123 Main St, Toronto, ON"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
          
          {/* New: Payment Method with Radio Buttons */}
          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <RadioGroup>
              <RadioItem
                id="payment-cash"
                value="Cash"
                checked={paymentMethod === "Cash"}
                onChange={setPaymentMethod}
                label="Cash"
              />
              <RadioItem
                id="payment-eft"
                value="EFT"
                checked={paymentMethod === "EFT"}
                onChange={setPaymentMethod}
                label="EFT"
              />
              <RadioItem
                id="payment-card"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={setPaymentMethod}
                label="Card"
              />
            </RadioGroup>
          </div>
          {/* End New: Payment Method */}

          {/* WhatsApp checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="use-whatsapp"
              checked={useWhatsApp}
              onCheckedChange={(v) => setUseWhatsApp(!!v)}
              aria-label="Prefer WhatsApp updates"
            />
            <Label htmlFor="use-whatsapp">I prefer updates via WhatsApp</Label>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="relative overflow-hidden transition-all bg-blue-700 hover:bg-blue-800 text-white hover:shadow-[0_0_15px_rgba(30,64,175,0.5)]"
            disabled={submitting}
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function SchedulePage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Schedule a Service
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Fill out the form below to book your preferred service date and time.
      </p>
      <ScheduleForm />
    </div>
  )
}