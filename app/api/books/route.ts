import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { like } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q") || "";
  const session = await auth();

  try {
    const booksList = await db
      .select()
      .from(books)
      .where(like(books.title, `%${query}%`))
      .limit(20);

    const userId = session?.user?.id as string;

    return NextResponse.json({ Books: booksList, user: userId });
  } catch (err: any) {
    if (err.name !== "AbortError") {
      console.error("Failed to fetch books", err);
    }
    return NextResponse.json(
      { error: "Failed to search books" },
      { status: 500 },
    );
  }
}
