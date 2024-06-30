import React, { useEffect } from "react";
import Search from "@/components/Search";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import Hero from "@/components/Hero";
import Recommendations from "@/components/Recommendations";
import Footer from "@/components/Footer";
import Minted from "@/components/Minted";

export default function Home() {
  return (
    <main className='min-h-screen flex flex-col w-full bg-[#1e1e1e]'>
      <Navbar />
      <Separator />

      <div className='h-[calc(100vh-92px)] bg-[#1e1e1e]'>
        <Hero />
      </div>

      {/* <div className='h-screen bg-[#1e1e1e]'>
        <Recommendations />
      </div> */}

      <div className='flex-grow min-h-screen bg-[#1e1e1e]'>
        <Recommendations />
      </div>

      <div className='flex-grow min-h-screen bg-[#1e1e1e]'>
        <Minted />
      </div>

      <Footer />
    </main>
  );
}
