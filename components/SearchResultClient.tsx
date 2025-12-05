"use client";

import { useEffect, useState } from "react";
import BookList from "@/components/BookList";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface SearchResultClientProps {
  searchQuery: string;
  department: string;
}

const SearchResultClient = ({
  searchQuery,
  department,
}: SearchResultClientProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 5;

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/books?q=${encodeURIComponent(searchQuery)}&dept=${encodeURIComponent(department)}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setBooks((data.Books as Book[]) || []);
        setUserId(data.userId as string);
        setCurrentPage(1); // Reset to first page on new search
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery || department) {
      fetchBooks();
    } else {
      setBooks([]);
    }

    return () => controller.abort();
  }, [searchQuery, department]);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = books.slice(indexOfFirst, indexOfLast);

  if (loading) return <p className="text-center mt-20">Loading books...</p>;

  if (books.length === 0)
    return <p className="text-center mt-20 text-gray-400">No books found.</p>;

  return (
    <div className="mt-28">
      <BookList
        title="Search Result"
        books={currentBooks}
        userId={userId}
        containerClassName=""
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i} className="pagination-btn_light">
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SearchResultClient;
