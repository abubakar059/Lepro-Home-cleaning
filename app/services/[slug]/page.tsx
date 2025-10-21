import { notFound } from "next/navigation"
import Link from "next/link"
import { services } from "@/lib/services"
import { GlowButton } from "@/components/glow-button"

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug)
  if (!service) return notFound()

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className="w-full h-64 md:h-80 object-cover rounded-xl border"
        />
        <div>
          <h1 className="text-3xl font-semibold text-pretty">{service.title}</h1>
          <p className="text-muted-foreground mt-3 text-pretty">{service.longDescription}</p>
          <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
            <li>Eco-friendly and pet-safe supplies</li>
            <li>Timely service with Canadian reliability</li>
            <li>Flexible scheduling that fits your day</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <GlowButton asChild>
              <Link href={`/schedule?service=${encodeURIComponent(service.title)}`}>Book this service</Link>
            </GlowButton>
            <GlowButton variant="outline" asChild>
              <Link href="/services">View all services</Link>
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  )
}
