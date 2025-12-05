"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SearchResultClient from "@/components/SearchResultClient";
import Image from "next/image";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");

  return (
    <section>
      <div className="text-center mt-10">
        <h2 className="text-light-100 font-semibold uppercase mb-2">
          Discover your next great read:
        </h2>
        <h1 className="text-white text-3xl xs:text-4xl md:text-5xl font-bold leading-tight">
          Explore and Search for <br />
          <span className="text-primary">Any Book</span> In Our Library
        </h1>

        {/*Search Bar*/}
        <label className="search justify-start cursor-text gap-3 px-5">
          <Image
            src="/icons/search.svg"
            alt="search"
            width={20}
            height={20}
            className="text-light-100"
          />
          <input
            type="text"
            placeholder="Thriller Mystery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input bg-transparent focus:outline-none"
          />
        </label>
      </div>

      {/* Filter Dropdown */}
      <div className="mt-10 flex justify-center gap-4">
        <div className="relative w-40">
          <select
            className="select-trigger appearance-none"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Filter by: Department</option>
            <option value="cs">Computer Science</option>
            <option value="mech">Mechanical</option>
            <option value="ee">Electrical</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-light-100 pointer-events-none" />
        </div>
      </div>

      {/* Search Results */}
      <div className="book-list mt-28">
        <SearchResultClient searchQuery={searchQuery} department={department} />
      </div>
    </section>
  );
};

export default SearchPage;
