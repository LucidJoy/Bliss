import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className='bg-[#1E1E1E] text-white px-4 lg:px-6 py-6 flex flex-col sm:flex-row items-center justify-between'>
      <div className='text-sm'>
        &copy; 2024 NFT Marketplace. All rights reserved.
      </div>
      <nav className='flex gap-4 sm:gap-6 mt-4 sm:mt-0'>
        <Link
          href='#'
          className='text-sm font-medium hover:underline underline-offset-4 transition-colors duration-300 ease-in-out hover:text-[#FF6B6B]'
          prefetch={false}
        >
          Terms of Service
        </Link>
        <Link
          href='#'
          className='text-sm font-medium hover:underline underline-offset-4 transition-colors duration-300 ease-in-out hover:text-[#FF6B6B]'
          prefetch={false}
        >
          Privacy Policy
        </Link>
        <Link
          href='#'
          className='text-sm font-medium hover:underline underline-offset-4 transition-colors duration-300 ease-in-out hover:text-[#FF6B6B]'
          prefetch={false}
        >
          Contact
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
