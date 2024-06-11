import React from "react";
import { TrendingUpIcon } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";

const data = {
  labels: ["March", "April", "May", "June"],
  datasets: [
    {
      label: "Price",
      data: [65, 80, 70, 95], //PRICES
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)", // Red line
      borderWidth: 1,
      pointRadius: 5, // Larger points
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const ID = () => {
  return (
    <div className='bg-[#1e1e1e] h-[100vh]'>
      <Navbar />
      <Separator />

      <div className='flex flex-row bg-[#1e1e1e]'>
        <div className='flex-1 flex flex-col gap-[40px] items-center justify-center mt-[100px]'>
          <div className='relative w-[500px] h-[500px] overflow-hidden rounded-[10px]'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#FF6B6B] to-[#8B5CF6] opacity-50' />
            {/* IMG */}
          </div>

          <div className='grid gap-4 mb-[20px]'>
            <div className='bg-[#2C2C2C] w-[500px] rounded-lg p-4 flex flex-col items-center justify-center space-y-2'>
              <div className='text-sm font-medium bricolage'>
                Galactic Guardians
              </div>
              <div className='text-gray-300 text-sm syne'>
                Explore the Galactic Guardians NFT collection, featuring unique
                and captivating 3D characters that transport you to a futuristic
                cosmic realm.
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <TrendingUpIcon className='h-5 w-5 text-[#FF6B6B]' />
                <div className='text-sm font-medium text-[#FF6B6B] syne'>
                  Trending
                </div>
              </div>
              <button className='bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 syne'>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className='flex-1 flex items-start mt-[100px] justify-center'>
          <div>
            <h1 className='bricolage text-6xl font-bold tracking-tight'>
              Galactic Guardians
            </h1>
            <p className='mx-auto max-w-[700px] text-[#D1D5DB] text-[18px] mt-[10px] syne'>
              Discover the Galactic Guardians NFT, a unique and captivating
              collection that transports you to a futuristic cosmic realm. These
              3D characters are meticulously crafted to showcase the pinnacle of
              digital art and innovation.
            </p>
            <div className='space-x-4 mt-[30px]'>
              <button className='bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 syne'>
                Buy Now
              </button>
              <button
                className='inline-flex h-9 items-center justify-center rounded-md border border-[#FF6B6B] bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B] outline-none'
                href='#'
              >
                View Collection
              </button>
            </div>

            <div className='mt-8 mb-4'>
              <Separator />
            </div>

            <div className='flex flex-col items-start justify-center gap-[10px]'>
              <div className='bricolage tracking-tight font-semibold text-[28px]'>
                Price History
              </div>
              <div className=' bg-[#2C2C2C] rounded-lg p-4 max-w-[400px]'>
                <Line data={data} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ID;
