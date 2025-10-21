"use client"

import { motion } from "framer-motion"
import { GlowButton } from "@/components/glow-button"
import Link from "next/link"

export default function PricingPage() {
  const pricingCategories = [
    {
      title: "Standard Cleaning",
      subtitle: "Weekly/Bi-weekly",
      image: "/standard.jpg",
      services: [

        { name: "Studio/1 Bedroom Apartment", price: "$70.00" },
        { name: "2 Bedroom Apartment/House", price: "$95.00" },
        { name: "3 Bedroom House", price: "$125.00" },
        
      ],
    },
    {
      title: "Deep Cleaning",
      subtitle: "Monthly/One-Time",
      image: "/deepcleaning.jpg",
      services: [

        { name: "Studio/2 Bedroom Apartment", price: "$140.00" },
        { name: "3 Bedroom Apartment/House", price: "$190.00" },
        { name: "4 Bedroom House", price: "$235.00" },
      ],
    },
    {
      title: "Move-In/Move-Out Cleaning",
      subtitle: "One-Time Service",

      image: "/movedinout.png",
      services: [
        { name: "Studio/1 Bedroom Apartment", price: "$170.00" },
        { name: "3 Bedroom Apartment/House", price: "$235.00" },
        { name: "5 Bedroom House", price: "$310.00" },
      ],
    },
  ]



  return (
    <div>
      {/* 🌅 HERO SECTION */}
      <section className="relative overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}

          src="/heropicture.jpg"

          alt="Professional cleaning service"
          className="h-[60vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]"
            >
              Transparent Pricing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-muted-foreground text-pretty max-w-2xl"
            >
              No hidden fees. No surprises. Just honest, competitive pricing for professional cleaning services across
              Ottawa,ON
            </motion.p>
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <GlowButton asChild>
                <Link href="/quote">Get a Custom Quote</Link>
              </GlowButton>
              <GlowButton variant="outline" asChild>
                <Link href="/schedule">Book Now</Link>
              </GlowButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 💰 PRICING CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
            Our Pricing Plans
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
  Choose the cleaning service that fits your needs. All prices are in CAD and include professional-grade
  cleaning supplies. <strong>Applicable taxes will be added at checkout.</strong>
</p>

        </motion.div>

        <div className="space-y-16">
          {pricingCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="bg-white rounded-2xl border border-sky-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 sm:px-8 py-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">{category.title}</h3>
                <p className="text-blue-100 text-sm sm:text-base mt-1">{category.subtitle}</p>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.2 + 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </motion.div>

                  {/* Pricing List */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.2 + 0.2 }}
                    className="flex flex-col justify-center"
                  >
                    <ul className="space-y-4">
                      {category.services.map((service, serviceIdx) => (
                        <motion.li
                          key={serviceIdx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: idx * 0.2 + serviceIdx * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg border border-sky-100 hover:border-sky-300 hover:shadow-md transition-all"
                        >
                          <span className="font-semibold text-gray-800">{service.name}</span>
                          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            {service.price}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ℹ️ ADDITIONAL INFO */}
      <section className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 border-y py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] mb-12"
          >
            What's Included?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Professional Supplies",
                desc: "We bring all eco-friendly, professional-grade cleaning products. No need to provide anything.",
              },
              {
                title: "Flexible Scheduling",
                desc: "Choose dates and times that work for you. We're available weekdays, weekends, and evenings.",
              },
              {
                title: "Satisfaction Guaranteed",
                desc: "Not happy with the results? We'll return and re-clean at no extra charge.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(56,189,248,0.3)" }}
                className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-sky-700 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 CTA SECTION */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] mb-6"
        >
          Ready to Get Started?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Get a personalized quote or book your cleaning service today. Our team is ready to make your space sparkle!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <GlowButton asChild>
            <Link href="/quote">Get a Quote</Link>
          </GlowButton>
          <GlowButton variant="outline" asChild>
            <Link href="/schedule">Book Service</Link>
          </GlowButton>
        </motion.div>
      </section>
    </div>
  )
}
