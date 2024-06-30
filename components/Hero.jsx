import React from "react";
import CreateBtn from "./CreateBtn";
import { CardEffect } from "./CardEffect";
import { PinCard } from "./PinCard";

const Hero = () => {
  return (
    <div className='h-full flex'>
      {/* col A */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='flex flex-col gap-[15px]'>
          <h1 className='bricolage text-5xl font-bold tracking-tight'>
            Unleash the Power of <br /> NFTs
          </h1>

          <p className='mx-auto max-w-[700px] text-xl text-white/60 syne'>
            Discover, collect, and trade the most unique and captivating NFTs on
            our vibrant and seamless marketplace.
          </p>

          <div className='w-[500px]'>
            <CreateBtn />
          </div>
        </div>
      </div>

      {/* col B */}
      <div className='flex-1 flex items-center justify-center'>
        {/* <CardEffect /> */}
        <PinCard />
      </div>
    </div>
  );
};

export default Hero;
