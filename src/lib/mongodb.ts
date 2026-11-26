
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI environment variable."
  );
}

const dbName = process.env.DB_NAME || "GearRento";

// Cache MongoClient across Next.js module reloads.
const globalForMongo = globalThis as typeof globalThis & {
  gearrentoMongoClient?: MongoClient;
};

const client =
  globalForMongo.gearrentoMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

globalForMongo.gearrentoMongoClient = client;

const db = client.db(dbName);

export { client, db };
