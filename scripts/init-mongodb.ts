// Run with: npx ts-node scripts/init-mongodb.ts

import { connectToDatabase, ensureIndexes } from "../lib/db"

async function main() {
  console.log("🔄 Initializing MongoDB...")

  try {
    const { db } = await connectToDatabase()
    console.log("✅ Connected to MongoDB")

    // Ensure indexes exist
    await ensureIndexes()
    console.log("✅ Indexes created/verified")

    // List collections
    const collections = await db.listCollections().toArray()
    console.log(
      "📦 Collections:",
      collections.map((c) => c.name),
    )

    // Get stats
    const bookingsCount = await db.collection("bookings").countDocuments()
    const emailsCount = await db.collection("email_logs").countDocuments()

    console.log(`📊 Stats:`)
    console.log(`   - Bookings: ${bookingsCount}`)
    console.log(`   - Email Logs: ${emailsCount}`)

    console.log("\n✨ MongoDB setup verified successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

main()
