import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "GearRento";

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables.");
}

if (!BETTER_AUTH_URL) {
  throw new Error("Missing BETTER_AUTH_URL in environment variables.");
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google OAuth credentials. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
  );
}

const client = new MongoClient(MONGODB_URI);

const db = client.db(DB_NAME);

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: ["customer", "owner", "admin"],
        required: false,
        input: false,
        defaultValue: "customer",
      },

      accountType: {
        type: ["customer", "owner"],
        required: false,
        input: true,
        defaultValue: "customer",
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const selectedType = (
            user as {
              accountType?: string;
            }
          ).accountType;

          const accountType = selectedType === "owner" ? "owner" : "customer";

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

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,

      prompt: "select_account",
    },
  },

  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519",
        },
      },

      jwt: {
        expirationTime: "10m",

        definePayload: ({ user }) => ({
          role: user.role ?? "customer",
        }),
      },
    }),
  ],
});
