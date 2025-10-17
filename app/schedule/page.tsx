"use client"

import { motion } from "framer-motion"
import { ScheduleForm } from "@/components/schedule-form"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function SchedulePage() {
  const { toast } = useToast()

  // ✅ Called when booking is successful
  const handleSuccess = () => {
    toast({
      title: "Booking submitted successfully!",
      description:
        "We've received your booking request. Please check your email for confirmation.",
    })
  }

  // ❌ Called when booking fails
  const handleError = (message: string) => {
    toast({
      title: "Booking failed",
      description: message || "Something went wrong. Please try again.",
      variant: "destructive",
    })
  }

  return (
    <motion.div
      className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 🧭 Animated Gradient Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Schedule Service Online
      </motion.h1>

      {/* 💬 Subtitle */}
      <motion.p
        className="text-center text-gray-600 mt-3 text-lg max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Choose your service, date, and time. We’ll send a confirmation to your email and can follow up by phone or
        WhatsApp if you prefer. Available across Canada.
      </motion.p>

      {/* 📅 Schedule Form */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        {/* Pass handlers to form */}
        <ScheduleForm onSuccess={handleSuccess} onError={handleError} />
      </motion.div>

      {/* 💚 WhatsApp Contact Button */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Link
          href="https://wa.me/16137161606"
          target="_blank"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-5 rounded-lg shadow-lg transition-all duration-300"
        >
          <FaWhatsapp className="text-2xl" />
          Chat on WhatsApp
        </Link>
      </motion.div>
    </motion.div>
  )
}
