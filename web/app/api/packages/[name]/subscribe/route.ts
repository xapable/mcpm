import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

// In production: store subscriptions in DB
// For now: stub returns OK
const subscriptions = new Map<string, Set<string>>();

// POST /api/packages/[name]/subscribe
export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;

  // TODO: get real userId from session
  if (!subscriptions.has(name)) {
    subscriptions.set(name, new Set());
  }
  subscriptions.get(name)!.add("user");

  return NextResponse.json({ subscribed: true });
}

// DELETE /api/packages/[name]/subscribe
export async function DELETE(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  subscriptions.get(name)?.delete("user");
  return NextResponse.json({ subscribed: false });
}

// GET /api/packages/[name]/subscribe — count
export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  const count = subscriptions.get(name)?.size || 0;
  return NextResponse.json({ count });
}
