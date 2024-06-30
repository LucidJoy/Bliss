"use client";

import React from "react";
import Link from "next/link";
import Nftcard from "./Nftcard";
import { useRouter } from "next/router";
import { useReadContract } from "thirdweb/react";
import { contract } from "@/utils/contract";
import { getNFTs } from "thirdweb/extensions/erc721";

const Minted = () => {
  const router = useRouter();

  const { data: nfts, refetch: refetchNFTs } = useReadContract(getNFTs, {
    contract: contract,
  });

  return (
    <div className='flex flex-col items-center justify-center gap-[15px] bg-[#1e1e1e]'>
      <div className='inline-block rounded-lg bg-[#FF6B6B] px-3 py-1 text-sm syne w-fit'>
        Minted NFTs
      </div>
      <h2 className='font-bold tracking-tight bricolage text-5xl'>
        Uncover all your creations
      </h2>
      <p className='max-w-[900px] text-xl text-white/60 syne'>
        Explore your most exclusive and enchanting NFTs.
      </p>

      <div className='w-full bg-[#1e1e1e] mb-[20px]'>
        <div className='mx-auto grid items-start gap-12 grid-cols-4 w-fit mt-[30px] '>
          {nfts && nfts.length > 0 ? (
            <>
              {nfts.map((nft) => (
                <Nftcard
                  text={nft.metadata.name}
                  btnName='Explore'
                  clicked='item/1'
                  image={nft.metadata.image}
                  nft={nft}
                />
              ))}
            </>
          ) : (
            <div className='mt-[200px] w-[calc(100vw-20px)] text-[#ff6b6b]/50 flex items-center justify-center bricolage text-[20px] font-medium'>
              No NFTs available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Minted;
