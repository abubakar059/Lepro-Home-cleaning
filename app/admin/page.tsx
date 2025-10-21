"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Booking, BookingStatus, Quote, QuoteStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

type BookingResponse = { bookings: Booking[] }
type QuoteResponse = { quotes: Quote[] }
type EmailLogResponse = {
  emails: { id: string; to: string; subject: string; createdAt: string; sent: boolean; error?: string }[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("adminLoggedIn") : null
    if (saved === "1") setLoggedIn(true)
  }, [])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setLoggedIn(true)
      if (typeof window !== "undefined") window.localStorage.setItem("adminLoggedIn", "1")
      setError("")
    } else {
      setError("Invalid credentials. Please use the demo username and password shown below.")
    }
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-12 md:py-16">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Restricted access</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="btn-glow">
                Login
              </Button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Demo credentials:</p>
              <p>
                Username: <span className="font-medium">{ADMIN_USERNAME}</span>
              </p>
              <p>
                Password: <span className="font-medium">{ADMIN_PASSWORD}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage bookings, quotes, and email notifications.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            if (typeof window !== "undefined") window.localStorage.removeItem("adminLoggedIn")
            setLoggedIn(false)
          }}
        >
          Logout
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-4 mt-8">
        <StatsCards />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingsPanel />
        </div>
        <div className="lg:col-span-1">
          <EmailLogPanel />
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuotesPanel />
        </div>
      </div>
    </div>
  )
}

function StatsCards() {
  const { data: bookingData } = useSWR<BookingResponse>("/api/bookings", fetcher, { refreshInterval: 4000 })
  const { data: quoteData } = useSWR<QuoteResponse>("/api/quotes", fetcher, { refreshInterval: 4000 })

  const bookings = bookingData?.bookings ?? []
  const quotes = quoteData?.quotes ?? []

  const bookingTotal = bookings.length
  const bookingPending = bookings.filter((b) => b.status === "pending").length
  const bookingAccepted = bookings.filter((b) => b.status === "accepted").length

  const quoteTotal = quotes.length
  const quotePending = quotes.filter((q) => q.status === "pending").length

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Total Bookings</CardTitle>
          <CardDescription>All time (in-memory)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{bookingTotal}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Bookings</CardTitle>
          <CardDescription>Awaiting decision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{bookingPending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Quotes</CardTitle>
          <CardDescription>All time (in-memory)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{quoteTotal}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Quotes</CardTitle>
          <CardDescription>Awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{quotePending}</div>
        </CardContent>
      </Card>
    </>
  )
}

function BookingsPanel() {
  const { data, isLoading, mutate } = useSWR<BookingResponse>("/api/bookings", fetcher, { refreshInterval: 4000 })
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all")
  const [q, setQ] = useState("")

  const items = useMemo(() => {
    const src = data?.bookings ?? []
    let filtered = statusFilter === "all" ? src : src.filter((b) => b.status === statusFilter)
    if (q) {
      const qq = q.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(qq) ||
          b.email.toLowerCase().includes(qq) ||
          (b.phone || "").toLowerCase().includes(qq) ||
          (b.service || "").toLowerCase().includes(qq) ||
          (b.location || "").toLowerCase().includes(qq),
      )
    }
    return filtered
  }, [data, statusFilter, q])

  async function updateStatus(id: string, status: "accepted" | "cancelled") {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      await mutate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Accept or cancel incoming requests</CardDescription>
      </CardHeader>
      <CardContent>
<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
  <div className="flex items-center gap-2">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value as any)}
      className="h-9 rounded-md border bg-transparent px-3"
      aria-label="Filter by status"
    >
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="cancelled">Cancelled</option>
    </select>
    <Button
      variant="secondary"
      onClick={() => {
        setStatusFilter("all")
        setQ("")
      }}
    >
      Reset
    </Button>

    {/* ✅ Clear All Bookings Button */}
    <Button
      variant="destructive"
      onClick={async () => {
        if (!confirm("Are you sure you want to delete all bookings? This action cannot be undone.")) return
        await fetch("/api/bookings", { method: "DELETE" })
        await mutate()
      }}
    >
      Clear All
    </Button>
  </div>
  <div className="w-full md:w-64">
    <Input placeholder="Search name, email, service..." value={q} onChange={(e) => setQ(e.target.value)} />
  </div>
</div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading bookings...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings match your filters.</p>
        ) : (
          <div className="mt-2 border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{b.email}</div>
                      <div className="text-xs text-muted-foreground">{b.phone}</div>
                    </TableCell>
                    <TableCell>{b.service || "-"}</TableCell>
                    <TableCell className="max-w-[220px] truncate" title={b.location || "-"}>
                      {b.location || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{b.date}</div>
                      <div className="text-xs text-muted-foreground">{b.time}</div>
                    </TableCell>
                    <TableCell>{b.whatsapp ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} type="booking" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          className="btn-glow"
                          disabled={b.status === "accepted"}
                          onClick={() => updateStatus(b.id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(b.id, "cancelled")}
                          disabled={b.status === "cancelled"}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QuotesPanel() {
  const { data, isLoading, mutate } = useSWR<QuoteResponse>("/api/quotes", fetcher, { refreshInterval: 4000 })
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all")
  const [q, setQ] = useState("")

  const items = useMemo(() => {
    const src = data?.quotes ?? []
    let filtered = statusFilter === "all" ? src : src.filter((quote) => quote.status === statusFilter)
    if (q) {
      const qq = q.toLowerCase()
      filtered = filtered.filter(
        (quote) =>
          quote.name.toLowerCase().includes(qq) ||
          quote.email.toLowerCase().includes(qq) ||
          (quote.phone || "").toLowerCase().includes(qq) ||
          (quote.serviceArea || "").toLowerCase().includes(qq),
      )
    }
    return filtered
  }, [data, statusFilter, q])

  async function updateStatus(id: string, status: QuoteStatus) {
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      await mutate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Requests</CardTitle>
        <CardDescription>Manage incoming quote requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 rounded-md border bg-transparent px-3"
              aria-label="Filter by status"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="contacted">Contacted</option>
            </select>
            <Button variant="secondary" onClick={() => setStatusFilter("all")}>
              Reset
            </Button>
          </div>
          <div className="w-full md:w-64">
            <Input placeholder="Search name, email, service area..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading quotes...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No quotes match your filters.</p>
        ) : (
          <div className="mt-2 border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Service Area</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Sq Ft</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.name || "-"}</TableCell>
                    <TableCell>
                      <a href={`mailto:${quote.email}`} className="text-sky-600 hover:underline">
                        {quote.email}
                      </a>
                    </TableCell>
                    <TableCell>{quote.phone || "-"}</TableCell>
                    <TableCell>{quote.serviceArea}</TableCell>
                    <TableCell className="capitalize">{quote.propertyType}</TableCell>
                    <TableCell>{quote.squareFootage}</TableCell>
                    <TableCell className="text-sm">{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={quote.status} type="quote" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          className="btn-glow"
                          disabled={quote.status === "reviewed"}
                          onClick={() => updateStatus(quote.id, "reviewed")}
                        >
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={quote.status === "contacted"}
                          onClick={() => updateStatus(quote.id, "contacted")}
                        >
                          Contacted
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status, type }: { status: BookingStatus | QuoteStatus; type: "booking" | "quote" }) {
  let color = "bg-amber-500 text-white"

  if (type === "booking") {
    color =
      status === "accepted"
        ? "bg-green-600 text-white"
        : status === "cancelled"
          ? "bg-red-600 text-white"
          : "bg-amber-500 text-white"
  } else {
    color =
      status === "reviewed"
        ? "bg-blue-600 text-white"
        : status === "contacted"
          ? "bg-green-600 text-white"
          : "bg-amber-500 text-white"
  }

  return <Badge className={color + " capitalize"}>{status}</Badge>
}

function EmailLogPanel() {
  const { data, mutate } = useSWR<EmailLogResponse>("/api/emails", fetcher, { refreshInterval: 5000 })
  const emails = data?.emails ?? []

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Email Log</CardTitle>
          <CardDescription>Recent notifications</CardDescription>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            await fetch("/api/emails", { method: "DELETE" })
            await mutate()
          }}
        >
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {emails.length === 0 ? (
          <p className="text-sm text-muted-foreground">No emails logged yet.</p>
        ) : (
          <ul className="space-y-3">
            {emails.slice(0, 15).map((e) => (
              <li key={e.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{e.subject}</div>
                  <Badge className={e.sent ? "bg-green-600 text-white" : "bg-amber-500 text-white"}>
                    {e.sent ? "sent" : "queued"}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span>To: {e.to}</span> · <span>{new Date(e.createdAt).toLocaleString()}</span>
                </div>
                {e.error ? <div className="text-xs text-red-600 mt-1">Error: {e.error}</div> : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
