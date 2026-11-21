import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// ======================================
// MongoDB Connection
// ======================================

const client = new MongoClient(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-cny9clf-shard-00-00.ilfvfer.mongodb.net:27017,ac-cny9clf-shard-00-01.ilfvfer.mongodb.net:27017,ac-cny9clf-shard-00-02.ilfvfer.mongodb.net:27017/?ssl=true&replicaSet=atlas-r83rr3-shard-0&authSource=admin`,
);

const db = client.db(process.env.DB_NAME || "GearRento");

// ======================================
// Better Auth Configuration
// ======================================

export const auth = betterAuth({
  // Authentication server URL
  baseURL: process.env.BETTER_AUTH_URL,

  // MongoDB Adapter
  database: mongodbAdapter(db, {
    client,
  }),

  // ======================================
  // User Fields and Role Security
  // ======================================

  user: {
    additionalFields: {
      // Actual authorization role
      // Cannot be changed through user input.
      role: {
        type: ["customer", "owner", "admin"],
        required: false,
        input: false,
        defaultValue: "customer",
      },

      // Public registration selection
      accountType: {
        type: ["customer", "owner"],
        required: false,
        input: true,
        defaultValue: "customer",
      },
    },
  },

  // ======================================
  // Server-Controlled Role Assignment
  // ======================================

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const selectedType = (user as { accountType?: string }).accountType;

          return {
            data: {
              ...user,

              // Only Customer or Owner can
              // register through the public form.
              role: selectedType === "owner" ? "owner" : "customer",
            },
          };
        },
      },
    },
  },

  // ======================================
  // Email and Password Authentication
  // ======================================

  emailAndPassword: {
    enabled: true,
  },

  // ======================================
  // Social Authentication
  // ======================================

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // ======================================
  // JWT Plugin for Express Backend
  // ======================================

  plugins: [
  jwt({
    jwks: {
      keyPairConfig: {
        alg: "EdDSA",
        crv: "Ed25519",
      },
    },

    jwt: {
      issuer: process.env.BETTER_AUTH_URL,
      audience: process.env.BETTER_AUTH_URL,
      expirationTime: "10m",

      definePayload: ({ user }) => ({
        role: user.role ?? "customer",
      }),
    },
  }),
],
});
