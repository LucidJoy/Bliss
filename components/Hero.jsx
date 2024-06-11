import React from "react";
import CreateBtn from "./CreateBtn";

const Hero = () => {
  return (
    <div className='h-full flex'>
      {/* col A */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='flex flex-col gap-[15px]'>
          <h1 className='bricolage text-5xl font-bold tracking-tight'>
            Unleash the Power of <br /> NFTs
          </h1>

          <p className='mx-auto max-w-[700px] text-xl text-gray-400'>
            Discover, collect, and trade the most unique and captivating NFTs on
            our vibrant marketplace.
          </p>

          <div className='w-[500px]'>
            <CreateBtn />
          </div>
        </div>
      </div>

      {/* col B */}
      <div className='flex-1 flex items-center justify-center'>b</div>
    </div>
  );
};

export default Hero;
