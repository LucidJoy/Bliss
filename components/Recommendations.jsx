import React from "react";
import Link from "next/link";
import Nftcard from "./Nftcard";
import { useRouter } from "next/router";
import { useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";
import { contract } from "@/utils/contract";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/client";
import { TRENDY_EVENTS } from "@/constants/constants";
import { ThreeDCardDemo } from "./ThreeDCard";

const Recommendations = () => {
  const router = useRouter();

  const { data: nfts, refetch: refetchNFTs } = useReadContract(getNFTs, {
    contract: contract,
  });

  return (
    <div className='flex flex-col items-center justify-center gap-[15px] bg-[#1e1e1e]'>
      <div className='inline-block rounded-lg bg-[#FF6B6B] px-3 py-1 text-sm syne w-fit'>
        Trending NFTs
      </div>
      <h2 className='font-bold tracking-tight bricolage text-5xl'>
        Discover the Latest Trends
      </h2>
      <p className='max-w-[900px] text-xl text-white/60 syne'>
        Discover the most unique and captivating NFT collections on our
        platform.
      </p>

      <div className='mx-auto grid items-start gap-12 md:grid-cols-4 sm:grid-cols-2 w-fit mt-[30px] '>
        {
          <>
            {TRENDY_EVENTS.events.map((nft) => (
              <Nftcard
                text={nft.name}
                btnName='Explore'
                clicked='item/1'
                image={nft.image_url}
                nft={nft}
                price={nft.price}
                trending={true}
              />
            ))}
            {/* <ThreeDCardDemo /> */}
          </>
        }
      </div>
    </div>
  );
};

export default Recommendations;
