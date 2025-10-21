import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowButton } from "./glow-button"

type Service = {
  slug: string
  title: string
  shortDescription: string
  image: string
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group overflow-hidden">
      <img
        src={service.image || "/placeholder.svg"}
        alt={service.title}
        className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <CardHeader>
        <CardTitle className="text-pretty">{service.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
        <div className="mt-4">
          <GlowButton variant="outline" asChild>
            <Link href={`/services/${service.slug}`}>Learn more</Link>
          </GlowButton>
        </div>
      </CardContent>
    </Card>
  )
}
