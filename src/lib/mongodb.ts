import { MongoClient } from "mongodb";

// ======================================
// Environment Configuration
// ======================================

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "GearRento";

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

// ======================================
// MongoDB Connection Options
// ======================================

const options = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
};

// ======================================
// Development Client Cache
// ======================================

const globalForMongo = globalThis as typeof globalThis & {
  gearrentoMongoClient?: MongoClient;
};

// ======================================
// MongoDB Client
// ======================================

// Reuse across development hot reloads.
// Production serverless instances reuse
// their module-scoped client.

const client =
  (process.env.NODE_ENV === "development"
    ? globalForMongo.gearrentoMongoClient
    : undefined) ?? new MongoClient(MONGODB_URI, options);

if (process.env.NODE_ENV === "development") {
  globalForMongo.gearrentoMongoClient = client;
}

// ======================================
// MongoDB Database
// ======================================

const db = client.db(DB_NAME);

// ======================================
// Explicit Connection Helper
// ======================================

export async function ensureMongoConnected() {
  try {
    await client.connect();
  } catch (error) {
    console.error("[GearRento] MongoDB connection failed:", error);

    throw error;
  }
}



export { client, db };
