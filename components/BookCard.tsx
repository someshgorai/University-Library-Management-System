import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { and, eq } from "drizzle-orm";

interface Props extends Book {
  userId: string;
}

const BookCard = async ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  userId,
}: Props) => {
  if (!userId) return null;
  const result = await db
    .select({
      dueDate: borrowRecords.dueDate,
    })
    .from(borrowRecords)
    .where(
      and(
        eq(borrowRecords.bookId, id),
        eq(borrowRecords.userId, userId),
        eq(borrowRecords.status, "BORROWED"),
      ),
    )
    .limit(1);

  const loanRecord = result[0];
  let remainingDays: number | null = null;
  let dueText = "";
  let textClass = "text-light-100";

  if (loanRecord) {
    const due = new Date(loanRecord.dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const absDays = Math.abs(remainingDays);
    const dayWord = absDays === 1 ? "day" : "days";

    if (remainingDays >= 0) {
      dueText = `${remainingDays} ${dayWord} left to return`;
    } else {
      dueText = `Overdue by ${absDays} ${dayWord}`;
      textClass = "text-red-500 font-semibold";
    }
  }

  return (
    <li className={cn(!!loanRecord && "xs:w-52 w-full")}>
      <Link
        href={`/books/${id}`}
        className={cn(!!loanRecord && "w-full flex flex-col items-center")}
      >
        <BookCover coverColor={coverColor} coverImage={coverUrl} />

        <div className={cn("mt-4", !loanRecord && "xs:max-w-40 max-w-28")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>

        {!!loanRecord && remainingDays !== null && (
          <div className="mt-3 w-full">
            <div className="book-loaned flex items-center gap-2">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className={cn(textClass)}>{dueText}</p>
            </div>
            <Button
              variant="secondary"
              className={cn(
                "bg-dark-600 mt-3 min-h-14 w-full font-bebas-neue text-base text-primary",
                "hover:bg-dark-600/90",
              )}
            >
              Download receipt
            </Button>
          </div>
        )}
      </Link>
    </li>
  );
};

export default BookCard;
