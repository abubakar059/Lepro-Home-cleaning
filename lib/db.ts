import { MongoClient, type Db } from "mongodb"

const MONGODB_URI ="mongodb+srv://abubakar:Ejkx3eEnPwymvJZ3@cluster0.6qdotpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const DB_NAME = "leprohome"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db(DB_NAME)

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}

export async function ensureIndexes() {
  const db = await getDatabase()

  // Bookings indexes
  const bookingsCollection = db.collection("bookings")
  await bookingsCollection.createIndex({ createdAt: -1 })
  await bookingsCollection.createIndex({ email: 1 })
  await bookingsCollection.createIndex({ status: 1 })

  // Email logs indexes
  const emailLogsCollection = db.collection("email_logs")
  await emailLogsCollection.createIndex({ createdAt: -1 })
  await emailLogsCollection.createIndex({ to: 1 })
}
