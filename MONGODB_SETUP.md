# MongoDB Migration Guide

This project has been migrated from in-memory data storage to **MongoDB** for persistent data management. This guide explains the setup and configuration.

## What Changed

### Before (In-Memory Storage)
- Bookings stored in memory (lost on server restart)
- Email logs stored in memory (lost on server restart)
- No persistent database

### After (MongoDB)
- All bookings persisted in MongoDB
- All email logs persisted in MongoDB
- Data survives server restarts
- Scalable and production-ready

## Setup Instructions

### 1. Get a MongoDB Connection String

Choose one of these options:

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

#### Option B: Local MongoDB
1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service
3. Connection string: `mongodb://localhost:27017`

### 2. Add Environment Variable

Add your MongoDB connection string to your `.env.local` file:

\`\`\`bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leprohome?retryWrites=true&w=majority
\`\`\`

Or for local MongoDB:
\`\`\`bash
MONGODB_URI=mongodb://localhost:27017
\`\`\`

### 3. Verify Connection

The application will automatically:
- Connect to MongoDB on first request
- Create necessary collections (`bookings`, `email_logs`)
- Create indexes for optimal performance

## File Structure

### New Files
- `lib/db.ts` - MongoDB connection management
- `lib/mongodb-models.ts` - All database operations (CRUD for bookings and email logs)

### Updated Files
- `app/api/bookings/route.ts` - Now uses MongoDB
- `app/api/bookings/[id]/route.ts` - Now uses MongoDB
- `app/api/emails/route.ts` - Now uses MongoDB
- `lib/email.tsx` - Now logs to MongoDB

### Deprecated Files (Kept for Reference)
- `lib/bookings-store.ts` - No longer used
- `lib/email-log.ts` - No longer used

## Database Schema

### Bookings Collection
\`\`\`typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone: string,
  date: string,
  time: string,
  whatsapp: boolean,
  service?: string,
  location?: string,
  createdAt: string (ISO 8601),
  status: "pending" | "accepted" | "cancelled"
}
\`\`\`

### Email Logs Collection
\`\`\`typescript
{
  _id: ObjectId,
  to: string,
  subject: string,
  html: string,
  createdAt: string (ISO 8601),
  sent: boolean,
  error?: string
}
\`\`\`

## Indexes

The application automatically creates these indexes for performance:

**Bookings:**
- `createdAt: -1` (for sorting by newest first)
- `email: 1` (for finding bookings by email)
- `status: 1` (for filtering by status)

**Email Logs:**
- `createdAt: -1` (for sorting by newest first)
- `to: 1` (for finding emails by recipient)

## API Endpoints

All endpoints remain the same, but now use MongoDB:

### GET /api/bookings
Returns all bookings from MongoDB

### POST /api/bookings
Creates a new booking in MongoDB

### PATCH /api/bookings/[id]
Updates booking status in MongoDB

### GET /api/emails
Returns all email logs from MongoDB

### DELETE /api/emails
Clears all email logs from MongoDB

## Troubleshooting

### Connection Error
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:27017
\`\`\`
- Ensure MongoDB is running
- Check `MONGODB_URI` environment variable
- Verify connection string format

### Authentication Error
\`\`\`
Error: authentication failed
\`\`\`
- Check username and password in connection string
- Verify IP whitelist in MongoDB Atlas (if using cloud)
- Ensure user has database access permissions

### Collection Not Found
- Collections are created automatically on first use
- If missing, restart the application

## Migration from In-Memory Storage

If you had existing bookings in the in-memory store:
1. They will be lost when switching to MongoDB
2. To preserve data, export from the old system first
3. Then import into MongoDB using a migration script

## Performance Notes

- MongoDB queries are indexed for fast lookups
- Email logs are sorted by `createdAt` descending (newest first)
- Bookings are sorted by `createdAt` descending (newest first)
- Connection pooling is handled automatically by the MongoDB driver

## Next Steps

1. Set up MongoDB (Atlas or local)
2. Add `MONGODB_URI` to `.env.local`
3. Restart the development server
4. Test booking creation in `/schedule`
5. Check admin dashboard at `/admin` to see persisted bookings
