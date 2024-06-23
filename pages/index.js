import React, { useEffect } from "react";
import Search from "@/components/Search";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import Hero from "@/components/Hero";
import Recommendations from "@/components/Recommendations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className='h-[100vh] w-full bg-[#1e1e1e]'>
      <Navbar />
      <Separator />

      <div className='h-[calc(100vh-92px)] bg-[#1e1e1e]'>
        <Hero />
      </div>

      <div className='h-[100vh] bg-[#1e1e1e]'>
        <Recommendations />
      </div>

      <div className='bg-[#1e1e1e]'>
        <Footer />
      </div>
    </main>
  );
}
