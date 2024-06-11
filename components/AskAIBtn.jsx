"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import stars from "../assets/stars.svg";

const AskAIBtn = () => {
  return (
    <button className='relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none'>
      <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
      <div className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#353535] px-5 py-1 text-[14px] font-medium text-white backdrop-blur-3xl gap-[4px]'>
        <Image src={stars} />
        <p>Ask AI</p>
      </div>
    </button>
  );
};

export default AskAIBtn;
