"use client";

import React from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const Search = () => {
  const placeholders = [
    "Which is the best NFT?",
    "Recommend me a NFT",
    "How to buy a NFT?",
    "How to list items for sale?",
  ];

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className='w-[500px] flex flex-col justify-center items-center px-4 syne'>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Search;
