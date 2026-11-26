
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { client, db } from "@/lib/mongodb";

// ======================================
// GearRento Better Auth Configuration
// ======================================

// ======================================
// Environment Variables
// ======================================

const BETTER_AUTH_URL =
  process.env.BETTER_AUTH_URL;

const BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET;

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET;

// ======================================
// Validate Environment Variables
// ======================================

if (!BETTER_AUTH_URL) {
  throw new Error(
    "Missing BETTER_AUTH_URL environment variable."
  );
}

if (
  !BETTER_AUTH_SECRET ||
  BETTER_AUTH_SECRET.length < 32
) {
  throw new Error(
    "BETTER_AUTH_SECRET must contain at least 32 characters."
  );
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google OAuth credentials."
  );
}

// ======================================
// Better Auth Instance
// ======================================

export const auth = betterAuth({
  // ====================================
  // Application Configuration
  // ====================================

  appName: "GearRento",

  baseURL: BETTER_AUTH_URL,

  secret: BETTER_AUTH_SECRET,

  // ====================================
  // MongoDB Database Adapter
  // ====================================

  // MongoDB connection is shared through
  // src/lib/mongodb.ts.
  //
  // Do not create a new MongoClient here.

  database: mongodbAdapter(db, {
    client,
  }),

  // ====================================
  // User Configuration
  // ====================================

  user: {
    additionalFields: {
      // ==================================
      // User Role
      // ==================================

      role: {
        type: [
          "customer",
          "owner",
          "admin",
        ],

        required: false,

        // Users cannot directly set
        // their privileged role.

        input: false,

        defaultValue: "customer",
      },

      // ==================================
      // Account Type
      // ==================================

      accountType: {
        type: [
          "customer",
          "owner",
        ],

        required: false,

        input: true,

        defaultValue: "customer",
      },
    },
  },

  // ====================================
  // Database Hooks
  // ====================================

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const selectedType = (
            user as {
              accountType?: string;
            }
          ).accountType;

          // Only allow customer or owner.
          // Admin role is never assigned
          // from registration input.

          const accountType =
            selectedType === "owner"
              ? "owner"
              : "customer";

          return {
            data: {
              ...user,

              accountType,

              role: accountType,
            },
          };
        },
      },
    },
  },

  // ====================================
  // Email and Password Authentication
  // ====================================

  emailAndPassword: {
    enabled: true,
  },

  // ====================================
  // Google OAuth Authentication
  // ====================================

  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,

      clientSecret: GOOGLE_CLIENT_SECRET,

      prompt: "select_account",
    },
  },

  // ====================================
  // Better Auth Plugins
  // ====================================

  plugins: [
    // ==================================
    // JWT Authentication
    // ==================================

    jwt({
      // ==================================
      // JSON Web Key Set
      // ==================================

      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519",
        },

        // Keep private-key encryption enabled.

        disablePrivateKeyEncryption: false,
      },

      // ==================================
      // JWT Token Configuration
      // ==================================

      jwt: {
        expirationTime: "10m",

        // Add current user role to JWT.
        // The Express backend uses the role
        // for authorization.

        definePayload: ({ user }) => ({
          role: user.role ?? "customer",
        }),
      },
    }),
  ],
});
