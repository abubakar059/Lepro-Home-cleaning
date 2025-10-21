"use client"

import Link from "next/link"
import { GlowButton } from "@/components/glow-button"
import { services } from "@/lib/services"
import { ServiceCard } from "@/components/service-card"
import { motion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useEffect } from "react"

export default function HomePage() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 2500 })]
  )

  useEffect(() => {
    if (emblaApi) emblaApi.reInit()
  }, [emblaApi])

  return (
    <div>
      {/* 🌅 HERO SECTION */}
      <section className="relative overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="/bright-clean-modern-canadian-home-interior.jpg"
          alt="Bright, clean Canadian home interior"
          className="h-[60vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]"
              >
                Lepro Home Services
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-4 text-muted-foreground text-pretty"
              >
                Trusted indoor, outdoor, residential, commercial, and window cleaning — proudly serving communities across Canada. Book online in minutes with flexible date and time options.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <GlowButton asChild>
                  <Link href="/schedule">Schedule Service</Link>
                </GlowButton>
                <GlowButton variant="outline" asChild>
                  <Link href="/services">Explore All Services</Link>
                </GlowButton>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 💎 WHY CHOOSE US */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent mb-8 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
        >
          Why Choose Lepro?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-center max-w-2xl mx-auto mb-12"
        >
          We go beyond cleaning — providing care, reliability, and eco-conscious solutions for your home and business.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[ 
            { title: "✨ Expert Professionals", desc: "Trained and trusted staff ensuring top-quality service every time." },
            { title: "🌿 Eco-Friendly Approach", desc: "Safe, non-toxic products that care for your health and the planet." },
            { title: "🕒 Reliable Scheduling", desc: "Flexible booking and on-time arrival — your convenience first." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(56,189,248,0.3)" }}
              className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-sky-700 mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧹 OUR SERVICES */}
      <section aria-labelledby="services" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
        >
          Our Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground mt-2"
        >
          Professional cleaning tailored to Canadian homes and businesses.
        </motion.p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <ServiceCard service={s} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <motion.div
            whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(56,189,248,0.9)" }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <GlowButton asChild>
              <Link href="/services">See More →</Link>
            </GlowButton>
          </motion.div>
        </div>
      </section>

      {/* 🤝 OUR PROMISE SECTION */}
      <section className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 border-y py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] mb-6"
          >
            Our Promise To You
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Every home we clean, every office we service, and every customer we meet is treated with the same respect, care, 
            and attention to detail we’d give our own space. That’s the Lepro difference — quality, transparency, and satisfaction, guaranteed.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <GlowButton asChild>
              <Link href="/about">Learn More About Us</Link>
            </GlowButton>
          </motion.div>
        </div>
      </section>

      {/* 🏠 OUR WORK CAROUSEL */}
      <section aria-labelledby="our-work" className="bg-card/50 border-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
          >
            Our Work
          </motion.h2>

          <p className="text-muted-foreground mt-2">
            A glimpse of the quality we deliver across Canadian homes and businesses.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border" ref={emblaRef}>
            <div className="flex">
              {[
                "/images/work-window-cleaning.jpg",
                "/images/work-living-room.jpg",
                "/images/work-office.jpg",
                "/images/work-pressure-washing.jpg",
                "/images/work-kitchen.jpg",
                "/images/work-bathroom.jpg",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="flex-[0_0_33.3333%] px-2"
                >
                  <img
                    src={src}
                    alt={`Lepro Work ${i + 1}`}
                    className="w-full h-[250px] object-cover rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 py-16 border-y">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                q: "Do you provide services in all Canadian provinces?",
                a: "Yes! We serve homes and businesses across Canada. Check availability when booking online.",
              },
              {
                q: "Are your cleaning products safe for pets and children?",
                a: "Absolutely. We use eco-friendly, non-toxic products for your safety.",
              },
              {
                q: "Can I schedule recurring services?",
                a: "Yes! We offer weekly, bi-weekly, and monthly service plans.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-sky-700 mb-2">{item.q}</h4>
                <p className="text-muted-foreground">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 MEET THE TEAM */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent mb-8"
        >
          Meet Our Team
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Alice Johnson", role: "Founder & CEO", img: "/team/alice.jpg" },
            { name: "Mark Lee", role: "Operations Manager", img: "/team/mark.jpg" },
            { name: "Sophia Brown", role: "Lead Cleaner", img: "/team/sophia.jpg" },
            { name: "James Wilson", role: "Customer Support", img: "/team/james.jpg" },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition text-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h4 className="font-semibold text-sky-700">{member.name}</h4>
              <p className="text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📢 CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 py-16 text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to Experience Sparkling Clean Spaces?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 max-w-xl mx-auto"
        >
          Book your cleaning service online in minutes and let Lepro Home Services take care of the rest.
        </motion.p>
        <motion.div whileHover={{ scale: 1.05 }}>
          <GlowButton asChild>
            <Link href="/schedule">Book Now</Link>
          </GlowButton>
        </motion.div>
      </section>
    </div>
  )
}
