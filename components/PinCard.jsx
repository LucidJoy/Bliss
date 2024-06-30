"use client";

import React from "react";
import Image from "next/image";

import hero_img from "../assets/hero_img.png";
import { PinContainer } from "./ui/3d-pin";
import { CardEffect } from "./CardEffect";

export function PinCard() {
  return (
    <div className='h-[40rem] w-full flex items-center justify-center'>
      {/* <PinContainer
        title='Pixel Cards NFT'
        href='https://maketintsandshades.com/#1E1E1E'
      > */}
      <div>
        <Image
          src={hero_img}
          height={350}
          width={350}
          alt='image'
          className='rounded-xl'
        />
      </div>
      {/* </PinContainer> */}
    </div>
  );
}
