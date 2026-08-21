import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongo = globalThis as unknown as { mongoose?: MongooseCache };
const cached: MongooseCache = (globalForMongo.mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName: "pattu-memories" });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
