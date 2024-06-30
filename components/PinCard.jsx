"use client";
import React from "react";
import { PinContainer } from "./ui/3d-pin";
import { CardEffect } from "./CardEffect";

export function PinCard() {
  return (
    <div className='h-[40rem] w-full flex items-center justify-center '>
      <PinContainer
        title='Pixel Cards NFT'
        href='https://maketintsandshades.com/#1E1E1E'
      >
        <CardEffect />
      </PinContainer>
    </div>
  );
}
