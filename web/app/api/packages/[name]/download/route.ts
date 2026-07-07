import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// POST /api/packages/[name]/download — increment download count
export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;

  await db
    .update(packages)
    .set({ downloads: sql`${packages.downloads} + 1` })
    .where(eq(packages.name, name));

  return NextResponse.json({ ok: true });
}
