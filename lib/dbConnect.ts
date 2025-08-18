import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

// Use a global cache so Next.js doesn't create multiple connections in dev mode
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
