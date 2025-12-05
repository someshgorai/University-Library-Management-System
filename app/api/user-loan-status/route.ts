import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const bookId = req.nextUrl.searchParams.get("bookId");

  if (!userId || !bookId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const result = await db
    .select({ dueDate: borrowRecords.dueDate })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.bookId, bookId),
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED"),
      ),
    )
    .limit(1);

  return NextResponse.json(result[0] || {});
}
