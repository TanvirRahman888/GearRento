
import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

import {
  ensureMongoConnected,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth);

// ======================================
// Better Auth GET Handler
// ======================================

export async function GET(request: Request) {
  await ensureMongoConnected();

  return handlers.GET(request);
}

// ======================================
// Better Auth POST Handler
// ======================================

export async function POST(request: Request) {
  await ensureMongoConnected();

  return handlers.POST(request);
}
