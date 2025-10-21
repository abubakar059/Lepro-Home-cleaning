"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GlowButton } from "@/components/glow-button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e6f7f4] to-[#f2f9ff] mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
      {/* Header Section */}
      <header className="max-w-3xl text-center mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-600 to-teal-400 bg-clip-text text-transparent">
          About Lepro Home Services
        </h1>
        <p className="text-muted-foreground mt-4 text-lg text-pretty leading-relaxed">
          Proudly based in Canada, Lepro Home Services delivers dependable, eco-conscious cleaning for homes and
          businesses nationwide. We blend friendly local service with professional-grade standards that ensure every
          space shines — responsibly and beautifully.
        </p>
      </header>

      {/* Hero Images */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-sky-200 transition-all duration-300 bg-white/60 backdrop-blur-sm"
        >
          <img
            src="/residential-cleaning-canada-modern-home.jpg"
            alt="Canadian home interior maintained by Lepro Home Services"
            className="w-full h-72 object-cover scale-100 hover:scale-105 transition-transform duration-700"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-sky-200 transition-all duration-300 bg-white/60 backdrop-blur-sm"
        >
          <img
            src="/commercial-cleaning-office-canada.jpg"
            alt="Clean Canadian office environment serviced by Lepro"
            className="w-full h-72 object-cover scale-100 hover:scale-105 transition-transform duration-700"
          />
        </motion.div>
      </section>

      {/* Content Sections */}
      <section className="mt-16 space-y-12">
        <Section
          title="Our Story"
          content="Lepro began with a simple idea: to make quality cleaning accessible and sustainable. What started as a
          local neighbourhood service quickly grew into a nationwide operation trusted by thousands of homeowners and
          businesses. Our journey has been driven by care, innovation, and a commitment to every client’s peace of mind."
        />

        <Section
          title="Values that Guide Us"
          list={[
            "Respect for people, property, and the environment",
            "Unwavering consistency and reliability",
            "Eco-friendly and non-toxic cleaning supplies",
            "Clear communication and fair pricing",
            "Continuous staff training and integrity",
          ]}
        />

        <Section
          title="Where We Work"
          content="From bustling city centres to peaceful suburbs, Lepro teams are active across multiple provinces in Canada.
          We are constantly expanding our reach — so whether you’re in Toronto, Calgary, or a growing rural community,
          Lepro is here for you."
        />

        <Section
          title="Sustainability & Safety"
          content="We’re proud to be a green cleaning company. All our products are biodegradable and certified under
          Canadian environmental standards. Every member of our team receives safety and sanitation training to ensure
          your space is cleaned responsibly — protecting your family, staff, and pets."
        />

        <Section
          title="Our Guarantee"
          content="We stand behind every service with our 100% satisfaction guarantee. If you’re not completely happy,
          we’ll return promptly to make things right — no questions asked. Our goal is lasting trust and spotless results."
        />

        <Section
          title="Team Training & Screening"
          content="Our professionals undergo extensive background checks, WHMIS safety training, and skills certification.
          We also conduct refresher courses regularly to stay current with new cleaning technologies and eco-friendly
          techniques."
        />

        <Section
          title="Community & Local Focus"
          content="We take pride in supporting Canadian communities — from sponsoring local events to sourcing materials
          from domestic suppliers. By working with Lepro, you help strengthen Canada’s small business ecosystem."
        />

        <Section
          title="Certifications & Insurance"
          content="Lepro Home Services is fully insured, licensed, and compliant with provincial safety regulations.
          Our certifications include WHMIS awareness, eco-cleaning standards, and safe handling procedures to guarantee
          your peace of mind."
        />

        {/* ✅ New Additional Sections */}
        <Section
          title="Why Choose Lepro?"
          list={[
            "Fully trained and insured cleaning experts",
            "Customized cleaning plans for every home or business",
            "Use of modern tools and eco-certified products",
            "Flexible scheduling — same-day and weekend services available",
            "Proven track record with 98% client satisfaction rate",
          ]}
        />

        <Section
          title="Our Vision for the Future"
          content="Lepro is more than a cleaning company — it’s a movement towards smarter, greener living. We envision a Canada
          where every space supports wellness, productivity, and sustainability. Our focus for the future includes
          expanding smart-cleaning technology, introducing AI-powered scheduling, and achieving carbon-neutral operations
          by 2030."
        />

        <Section
          title="Meet Our Leadership"
          content="Our leadership team brings decades of experience in hospitality, operations, and environmental management.
          Their shared mission is simple — to deliver exceptional, eco-friendly cleaning with transparency and trust."
        />

        <Section
          title="Client Testimonials"
          list={[
            "“Lepro’s team was prompt, polite, and made my condo look brand new. Highly recommend!” — Sarah M., Toronto",
            "“They cleaned our entire office overnight and left everything spotless. Professional and efficient.” — Raj K., Calgary",
            "“The best cleaning service we’ve had in years. Eco-friendly and affordable!” — Marie L., Vancouver",
          ]}
        />

        <Section
          title="Our Promise"
          content="We promise to deliver peace of mind with every clean — ensuring that your home, office, or property receives
          the same care we’d give our own. At Lepro, we don’t just clean — we care."
        />
      </section>

      {/* CTA */}
      <div className="mt-16 text-center">
        <GlowButton asChild>
          <Link href="/schedule">Book a Cleaning</Link>
        </GlowButton>
        <p className="text-sm text-muted-foreground mt-3">
          Experience a spotless home, powered by sustainable care.
        </p>
      </div>
    </div>
  )
}

// ✅ Reusable Section Component
function Section({
  title,
  content,
  list,
}: {
  title: string
  content?: string
  list?: string[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-gray-100 rounded-2xl p-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-sky-400 to-teal-500 bg-clip-text text-transparent">
        {title}
      </h2>
      {content && (
        <p className="text-muted-foreground mt-3 text-pretty leading-relaxed">
          {content}
        </p>
      )}
      {list && (
        <ul className="mt-4 grid gap-2 text-muted-foreground">
          {list.map((item, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 text-sky-500 font-semibold">•</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
