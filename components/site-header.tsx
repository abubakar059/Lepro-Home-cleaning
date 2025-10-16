"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { services } from "@/lib/services"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav
        className={cn(
          // 🌌 Slightly darker glassy blue navbar
          "border-b border-blue-300 backdrop-blur-md supports-[backdrop-filter]:bg-blue-200/70 bg-blue-300/60 shadow-md text-gray-900 transition-colors"
        )}
        aria-label="Main Navigation"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 cursor-pointer">
              <Image src="/images/logo.jpg" alt="Lepro Home Services logo" width={32} height={32} className="rounded" />
              <span className="font-semibold">Lepro Home Services</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-blue-700 transition-colors cursor-pointer">
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-blue-700 transition-colors cursor-pointer">
                Services
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-56 bg-blue-200/90 backdrop-blur-md border border-blue-300 shadow-lg text-gray-900"
              >
                <DropdownMenuItem asChild>
                  <Link href="/services" className="hover:bg-blue-300/50 rounded-md cursor-pointer">
                    All Services
                  </Link>
                </DropdownMenuItem>
                {services.map((s) => (
                  <DropdownMenuItem asChild key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="hover:bg-blue-300/50 rounded-md cursor-pointer">
                      {s.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="hover:text-blue-700 transition-colors cursor-pointer">
              About Us
            </Link>
          </div>

          <div className="hidden md:block">
            <Button asChild className="btn-glow bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
              <Link href="/schedule">Book Now</Link>
            </Button>
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-blue-400 hover:bg-blue-200 cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t bg-blue-200/80 backdrop-blur-xl text-gray-900 shadow-lg">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
              <ul className="grid gap-2">
                <li>
                  <Link href="/" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-700 cursor-pointer">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="block py-2 font-medium">Services</span>
                  <ul className="pl-4">
                    <li>
                      <Link href="/services" onClick={() => setOpen(false)} className="block py-1 hover:text-blue-700 cursor-pointer">
                        All Services
                      </Link>
                    </li>
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          onClick={() => setOpen(false)}
                          className="block py-1 hover:text-blue-700 cursor-pointer"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <Link href="/about" onClick={() => setOpen(false)} className="block py-2 hover:text-blue-700 cursor-pointer">
                    About Us
                  </Link>
                </li>
                <li>
                  <Button asChild className="w-full btn-glow mt-2 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
                    <Link href="/schedule" onClick={() => setOpen(false)}>
                      Book Now
                    </Link>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
