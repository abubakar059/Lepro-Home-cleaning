"use client"

import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { services } from "@/lib/services"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ScheduleFormProps = {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function ScheduleForm({ onSuccess, onError }: ScheduleFormProps) {
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
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [submitting, setSubmitting] = useState(false)

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
          paymentMethod,
        }),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Failed to create booking")
      }

      // ✅ Success handler
      toast({
        title: `Thanks, ${name}!`,
        description: `We've received your request for ${service} on ${date} at ${time} (${location}).`,
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
      setPaymentMethod("credit-card")
    } catch (err: any) {
      const msg = err.message ?? "Please try again."
      toast({ title: "Could not book", description: msg, variant: "destructive" })
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

          {/* Date and time */}
          <div className="grid gap-2 md:grid-cols-2">
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

          <div className="grid gap-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method" className="focus:ring-2 focus:ring-primary/40 transition-all">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="debit-card">Debit Card</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="e-transfer">E-Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            className="relative overflow-hidden transition-all bg-primary text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            disabled={submitting}
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
