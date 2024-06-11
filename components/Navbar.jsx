import React, { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

import logo from "../assets/logo.svg";
import { cn } from "@/lib/utils";
import Search from "./Search";
import Connect from "./Connect";
import CreateBtn from "./CreateBtn";
import AskAIBtn from "./AskAIBtn";
import { TransactionButton } from "thirdweb/react";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className=' text-white py-[20px] px-[20px] flex justify-between items-center h-[92px]'>
      <Image
        src={logo}
        height={25}
        width={25}
        onClick={() => {
          router.push("/");
        }}
        alt='logo'
        className='hover:cursor-pointer'
      />

      <div className='flex flex-row items-center justify-center gap-[10px]'>
        <Search />
        <AskAIBtn />
      </div>

      {/* <ConnectKitButton /> */}
      <div className='flex items-center justify-center gap-[10px]'>
        <CreateBtn />
        <Connect />
      </div>
    </div>
  );
};

export default Navbar;
