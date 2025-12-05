"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props extends Book {
  userId: string;
}

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  userId,
}: Props) => {
  const [loanRecord, setLoanRecord] = useState<any | null>(null);
  const [dueText, setDueText] = useState<string>("");
  const [textClass, setTextClass] = useState<string>("text-light-100");

  useEffect(() => {
    const fetchDue = async () => {
      try {
        const res = await fetch(
          `/api/user-loan-status?userId=${userId}&bookId=${id}`,
        );
        const data = await res.json();
        const record = data[0];
        setLoanRecord(record);

        if (record) {
          const due = new Date(record.dueDate);
          const today = new Date();
          due.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          const diffTime = due.getTime() - today.getTime();
          const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const absDays = Math.abs(remainingDays);
          const dayWord = absDays === 1 ? "day" : "days";

          if (remainingDays >= 0) {
            setDueText(`${remainingDays} ${dayWord} left to return`);
          } else {
            setDueText(`Overdue by ${absDays} ${dayWord}`);
            setTextClass("text-red-500 font-semibold");
          }
        }
      } catch (error) {
        console.error("Error fetching loan status", error);
      }
    };

    if (userId) fetchDue();
  }, [userId, id]);

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

        {!!loanRecord && dueText && (
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
