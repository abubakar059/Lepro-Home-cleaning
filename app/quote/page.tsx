"use client"

import { motion } from "framer-motion"
import { QuoteForm } from "../../components/quote-form"

export default function QuotePage() {
return (
    <div>
      {/* Hero Section */}
    <section className="relative overflow-hidden">
        <motion.img
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        src="/commercial-cleaning-office-canada.jpg"
        alt="Professional cleaning service"
        className="h-[50vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/40" />
        <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
            <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]"
            >
            Online Quote
            </motion.h1>
            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-muted-foreground text-pretty max-w-2xl"
            >
            Get an instant price quote for your cleaning service. Fill out the form below with details about your
            property and cleaning needs.
            </motion.p>
        </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <QuoteForm />
        </motion.div>
      </section>

      {/* Info Section */}
      <section className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 border-y py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent mb-8"
          >
            How Our Pricing Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Fill Out the Form",
                desc: "Provide details about your property, cleaning needs, and preferences.",
              },
              {
                title: "Instant Quote",
                desc: "Receive an accurate price estimate based on your specific requirements.",
              },
              {
                title: "Book Your Service",
                desc: "Schedule your cleaning at a time that works best for you.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-sky-700 mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
