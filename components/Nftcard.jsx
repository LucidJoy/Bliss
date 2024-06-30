import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/client";
import { contract } from "@/utils/contract";

const Nftcard = ({ text, btnName, clicked, image, nft, trending }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push({
      pathname: `item/${nft.id}`,
      query: {
        name: nft.metadata.name,
        image: nft.metadata.image,
        description: nft.metadata.description,
        price: nft.metadata.attributes[0].value,
        tokenId: Number(nft.id),
      },
    });
  };

  return (
    <button
      className='bg-[#2C2C2C] rounded-lg py-5 w-[250px] flex flex-col items-center justify-center space-y-2 transition-transform duration-300 ease-in-out hover:scale-105'
      onClick={handleClick}
      disabled={trending}
      // onClick={() => console.log(Number(nft.id))}
    >
      <MediaRenderer
        client={client}
        src={image}
        style={{
          width: "200px",
          height: "200px",
          aspectRatio: "200/200",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <div className='text-[15px] font-normal bricolage pt-[10px]'>{text}</div>

      {!trending && (
        <div className='flex flex-row items-center justify-between w-full px-[25px] pt-[10px]'>
          <p className='inline-flex h-8 items-center justify-center rounded-md bg-[#FF6B6B] px-4 text-sm font-medium text-white shadow transition-colors hover:bg-[#FF6B6B]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B6B] disabled:pointer-events-none disabled:opacity-50 syne'>
            {btnName}
          </p>

          <p className='bricolage text-[16px] font-medium'>
            {nft.metadata?.attributes[0]?.value}{" "}
            <span className='text-white/80 text-sm'>ETH</span>
          </p>
        </div>
      )}
    </button>
  );
};

export default Nftcard;
