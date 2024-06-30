"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import stars from "../assets/stars.svg";

const AskAIBtn = ({ createPage, text, func }) => {
  return (
    <button
      className='relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none'
      onClick={func}
    >
      <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF6B6B_0%,#E2CBFF_50%,#FF6B6B_100%)]' />
      <div className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#353535] px-5 py-1 text-[14px] font-medium text-white backdrop-blur-3xl gap-[4px]'>
        <Image src={stars} />
        <p className='bricolage'>
          {/* {createPage ? "Ask AI to generate a NFT" : "Ask AI"} */}
          {text}
        </p>
      </div>
    </button>
  );
};

export default AskAIBtn;
