import React from "react";

const Page = () => {
  return (
    <main className="root-container flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-bebas-neue text-center text-5xl font-bold text-light-100">
        🕒 Slow down! We’re processing things — try again in a bit.
      </h1>
      <p className="mt-3 max-w-xl text-center text-light-400">
        Looks like you have been a little too eager. we have put a temporary
        pause on your excitement. 🚦Chill for a bit and try again shortly.
      </p>
    </main>
  );
};
export default Page;
