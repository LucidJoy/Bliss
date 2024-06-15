import React, { useState } from "react";
import Cards from "react-credit-cards-2";

import { cn } from "@/utils/cn";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import PaymentForm from "@/components/PaymentForm";
import Footer from "@/components/Footer";

const Wallet = () => {
  return (
    <div className='flex flex-col min-h-[100dvh] bg-[#1e1e1e]'>
      <Navbar />
      <Separator />

      <main className='flex-1'>
        <section className='py-20 px-6'>
          <div className='container mx-auto max-w-2xl'>
            <h2 className='text-4xl font-bold mb-8 bricolage'>
              Payment Information
            </h2>

            <div className='bg-[#2C2C2C] rounded-lg p-8 shadow-lg'>
              <PaymentForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Wallet;
