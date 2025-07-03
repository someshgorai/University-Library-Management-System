import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(20)
    .orderBy(desc(books.createdAt))) as Book[];
  return (
    <div>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
        userId={session?.user?.id as string}
      />
    </div>
  );
};
export default Home;
