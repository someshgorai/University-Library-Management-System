import React from "react";
import BookCard from "@/components/BookCard";

interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
  userId: string;
}
const BookList = ({ title, books, containerClassName, userId }: Props) => {
  if (books.length < 2) return;

  return (
    <section className={containerClassName}>
      <h1 className="font-bebas-neue text-4xl text-light-100">{title}</h1>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.id} {...book} userId={userId} />
        ))}
      </ul>
    </section>
  );
};
export default BookList;
