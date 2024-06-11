import React from "react";
import Link from "next/link";
import Nftcard from "./Nftcard";

const Recommendations = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-[15px]'>
      <div className='inline-block rounded-lg bg-[#FF6B6B] px-3 py-1 text-sm syne w-fit'>
        Trending NFTs
      </div>
      <h2 className='font-bold tracking-tight bricolage text-5xl'>
        Discover the Latest Trends
      </h2>
      <p className='max-w-[900px] text-xl text-gray-400 syne'>
        Discover the most unique and captivating NFT collections on our
        platform.
      </p>

      <div className='mx-auto grid items-start gap-12 grid-cols-3 w-fit mt-[30px]'>
        <Nftcard text='Whimsical Wonders' btnName='Explore' />
        <Nftcard text='Ethereal Enigmas' btnName='Explore' />
        <Nftcard text='Futuristic Fusions' btnName='Explore' />
      </div>
    </div>
  );
};

export default Recommendations;
