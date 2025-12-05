import React from "react";
import { auth, signOut } from "@/auth";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { and, eq } from "drizzle-orm";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!session || !userId) redirect("/sign-in");

  const borrowedBooks = (await db
    .select({
      id: books.id,
      title: books.title,
      genre: books.genre,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      createdAt: books.createdAt,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      and(
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED"),
      ),
    )) as Book[];

  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button className="btn">Sign Out</Button>
      </form>

      <BookList title="Borrowed Books" books={borrowedBooks} userId={userId} />
    </div>
  );
};

export default Page;
