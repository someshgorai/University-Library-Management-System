import React from "react";
import { signOut } from "@/auth";
import { sampleBooks } from "@/constants";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";

const Page = () => {
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

      <BookList title="Borrowed Books" books={sampleBooks} />
    </div>
  );
};
export default Page;
