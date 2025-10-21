import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster" 

export const metadata: Metadata = {
  title: "Lepro Home Services | Canada",
  description:
    "Lepro Home Services — Professional indoor, outdoor, residential, commercial, and window cleaning across Canada. Book online with flexible date and time.",
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/images/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: { url: "/images/logo.png", sizes: "180x180", type: "image/png" },
  },
  generator: "v0.app",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-50 text-gray-900`}
      >
        <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
          <SiteHeader />

          <main className="pt-20 animate-fade-in-up">{children}</main>

          {/* ✅ Add toaster here for global popups */}
          <Toaster />

          <footer className="border-t border-sky-100 bg-gradient-to-r from-blue-50 via-sky-100 to-cyan-50 backdrop-blur-lg shadow-inner mt-10 animate-fade-in-up">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <h2 className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                    Lepro Home Services
                  </h2>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    Delivering spotless homes and offices across Canada — with care, consistency, and a smile.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-sky-700">Contact</h3>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed space-y-2">
                    <span className="block">
                      📧{" "}
                      <a
                        href="mailto:admin@leprohomeservices.ca"
                        className="text-sky-600 hover:text-sky-800 font-medium transition-colors underline underline-offset-2"
                      >
                        admin@leprohomeservices.ca
                      </a>
                    </span>
                    <span className="block">
                      📞{" "}
                      <a
                        href="tel:+16137161606"
                        className="text-sky-600 hover:text-sky-800 font-medium transition-colors"
                      >
                        +1 (613) 716-1606
                      </a>
                    </span>
                    <span className="block">📍 7096 Mason St</span>
                    <span className="block">🕐 Mon–Sat, 8am–6pm</span>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-sky-700">Quick Links</h3>
                  <ul className="mt-3 text-sm space-y-2">
                    <li>
                      <a href="/services" className="hover:text-sky-600 transition duration-200">
                        All Services
                      </a>
                    </li>
                    <li>
                      <a href="/schedule" className="hover:text-sky-600 transition duration-200">
                        Schedule Service
                      </a>
                    </li>
                    <li>
                      <a href="/pricing" className="hover:text-sky-600 transition duration-200">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="/quote" className="hover:text-sky-600 transition duration-200">
                        Get Quote
                      </a>
                    </li>
                    <li>
                      <a href="/about" className="hover:text-sky-600 transition duration-200">
                        About Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-10 text-center">
                © {new Date().getFullYear()} Lepro Home Services. All rights reserved in Canada.
              </p>
            </div>
          </footer>
        </Suspense>

        <Analytics />
      </body>
    </html>
  )
}
