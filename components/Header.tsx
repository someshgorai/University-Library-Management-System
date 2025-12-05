"use client";

import React from "react";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icons/logo2.png" alt="logo" width={60} height={60} />
        <h1 className="text-3xl font-semibold text-white whitespace-nowrap">
          Bookery
        </h1>
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/" ? "text-light-200" : "text-light-100",
            )}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/search"
            className={cn(
              "text-base cursor-pointer capitalize",
              pathname === "/books" ? "text-light-200" : "text-light-100",
            )}
          >
            Search
          </Link>
        </li>

        <li>
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback className="bg-amber-100 ">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </header>
  );
};
export default Header;
