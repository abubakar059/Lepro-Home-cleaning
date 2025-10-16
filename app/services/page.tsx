import { services } from "@/lib/services"
import { ServiceCard } from "@/components/service-card"

export default function ServicesIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
      <h1 className="text-3xl font-semibold text-pretty">All Services</h1>
      <p className="text-muted-foreground mt-2">
        Indoor, outdoor, residential, commercial, and windows cleaning—tailored for Canadian homes and businesses.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>
    </div>
  )
}
