import mongoose from "mongoose";

/**
 * MongoDB Connection Utility
 * * In Next.js, a global variable is used to maintain a cached connection
 * across hot-reloads in development. This prevents creating a new
 * connection for every API request, which would quickly exhaust the
 * database's connection pool.
 */

const MONGO_URI = process.env.MONGO_URI as string;

// 1. Ensure the Connection String is present
if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose || { conn: null, promise: null };

export default async function connectDB() {
  // 2. Return the existing connection if it is already established
  if (cached.conn) return cached.conn;

  // 3. If no connection promise exists, initiate a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering for better error handling in serverless
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // 4. Await the connection promise and cache it
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on failure to allow retry
    throw e;
  }

  return cached.conn;
}
