"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Booking, BookingStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

type BookingResponse = { bookings: Booking[] }
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
    // persist demo login for convenience in preview
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
          <p className="text-muted-foreground mt-1">Manage bookings and email notifications.</p>
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

      <div className="grid gap-6 md:grid-cols-3 mt-8">
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
    </div>
  )
}

function StatsCards() {
  const { data } = useSWR<BookingResponse>("/api/bookings", fetcher, { refreshInterval: 4000 })
  const items = data?.bookings ?? []
  const total = items.length
  const pending = items.filter((b) => b.status === "pending").length
  const accepted = items.filter((b) => b.status === "accepted").length
  const cancelled = items.filter((b) => b.status === "cancelled").length

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Total Bookings</CardTitle>
          <CardDescription>All time (in-memory)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending</CardTitle>
          <CardDescription>Awaiting decision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{pending}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accepted</CardTitle>
          <CardDescription>Confirmed services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">
            {accepted} <span className="text-sm text-muted-foreground">/ Cancelled {cancelled}</span>
          </div>
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
            <Button variant="secondary" onClick={() => setStatusFilter("all")}>
              Reset
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
                      <StatusBadge status={b.status} />
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

function StatusBadge({ status }: { status: BookingStatus }) {
  const color =
    status === "accepted"
      ? "bg-green-600 text-white"
      : status === "cancelled"
        ? "bg-red-600 text-white"
        : "bg-amber-500 text-white"
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
