import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Nftcard = ({ text, btnName, clicked }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(clicked);
  };

  return (
    <button
      className='bg-[#2C2C2C] rounded-lg p-4 w-[250px] flex flex-col items-center justify-center space-y-2 transition-transform duration-300 ease-in-out hover:scale-105'
      onClick={handleClick}
    >
      <img
        alt={text}
        height='120'
        src='/placeholder.svg'
        style={{
          aspectRatio: "120/120",
          objectFit: "cover",
        }}
        width='120'
      />
      <div className='text-sm font-medium syne'>{text}</div>
      <p className='inline-flex h-8 items-center justify-center rounded-md bg-[#FF6B6B] px-4 text-sm font-medium text-white shadow transition-colors hover:bg-[#FF6B6B]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B6B] disabled:pointer-events-none disabled:opacity-50 syne'>
        {btnName}
      </p>
    </button>
  );
};

export default Nftcard;
