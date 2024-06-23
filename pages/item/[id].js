import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CryptoJS from "crypto-js";
import { TrendingUpIcon, Loader2 } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useActiveAccount } from "thirdweb/react";
import axios from "axios";
import { toast } from "sonner";

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

const CreditCardForm = () => {
  const elements = useElements();
  const stripe = useStripe();
  const account = useActiveAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  let SECRET_KEY = "";

  const onClickPay = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3001",
        },
        redirect: "if_required",
      });

      if (error) {
        throw error.message;
      }
      if (paymentIntent.status === "succeeded") {
        setIsComplete(true);
        alert("Payment complete!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = async (btnName) => {
    if (!account) return toast("No account connected.");

    // get user data from  mongodb
    const userData = await axios.get(
      `http://localhost:3000/api/users?walletAddress=${account.address}`
    );

    // decrypt function to get cardinfo
    const decryptData = (encryptedData) => {
      SECRET_KEY = localStorage.getItem("user_id");

      if (!SECRET_KEY) {
        toast("DEC: No secret key found!");
        return;
      }
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    };

    const decCardInfo = decryptData(userData.data.cardHash);
    console.log(decCardInfo);

    if (btnName === "num") {
      navigator.clipboard.writeText(decCardInfo.number);
      toast("Copied.");
    }

    if (btnName === "exp") {
      navigator.clipboard.writeText(decCardInfo.expiry);
      toast("Copied.");
    }

    if (btnName === "cvc") {
      navigator.clipboard.writeText(decCardInfo.cvc);
      toast("Copied.");
    }
  };

  return (
    <div>
      <div>
        <h1 className='text-white/80 bricolage text-[16px]'>
          Click to copy your card details
        </h1>

        <div className='flex flex-row items-center justify-between mt-[10px] mb-[20px]'>
          <Button
            className='bg-[#31313D] syne w-[140px] rounded-[5px] border border-[#424353] text-white hover:bg-[#31313d]/80 text-[14px]'
            onClick={() => handleCopy("num")}
          >
            Card Number
          </Button>
          <Button
            className='bg-[#31313D] syne w-[140px] rounded-[5px] border border-[#424353] text-white hover:bg-[#31313d]/80 text-[14px]'
            onClick={() => handleCopy("exp")}
          >
            Card Expiry
          </Button>
          <Button
            className='bg-[#31313D] syne w-[140px] rounded-[5px] border border-[#424353] text-white hover:bg-[#31313d]/80 text-[14px]'
            onClick={() => handleCopy("cvc")}
          >
            Card CVC
          </Button>
        </div>
      </div>
      <Separator className='mb-[20px]' />

      <PaymentElement className='bricolage' />

      <div
        disabled={isLoading || isComplete || !stripe || !elements}
        onClick={onClickPay}
      >
        {isComplete ? (
          "Payment Complete"
        ) : isLoading ? (
          "Payment processing..."
        ) : (
          <Button
            // onClick={}
            className='bg-[#FF6B6B] form-actions text-white hover:bg-[#FF6B6B]/90 w-full syne text-[14px] mt-[20px]'
            // disabled={}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

const ID = () => {
  const [clientSecret, setClientSecret] = useState("");

  const account = useActiveAccount();

  let SECRET_KEY = "";

  // if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  //   throw 'Did you forget to add a ". env. local" file?';

  const stripe = loadStripe(
    "pk_test_51K6zdpSJoWGgDvdeIGGXPCauuK2nTyMK1pnQTaQHpNFzDxAaIyEE0XKTu1JMm9v0ha9NscfjjyQ1KbSP9aIMepS800yVO8nvZM"
  );

  const handlePay = async () => {
    if (!account) return toast("No account connected.");

    // get user data from  mongodb
    const userData = await axios.get(
      `http://localhost:3000/api/users?walletAddress=${account.address}`
    );

    // decrypt function to get cardinfo
    const decryptData = (encryptedData) => {
      SECRET_KEY = localStorage.getItem("user_id");

      if (!SECRET_KEY) {
        toast("DEC: No secret key found!");
        return;
      }
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    };

    const decCardInfo = decryptData(userData.data.cardHash);
    console.log(decCardInfo);

    // use the data to input the card details in stripe

    try {
      const res = await fetch("http://localhost:3000/api/stripe-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: account?.address }),
      });
      if (res.ok) {
        const json = await res.json();
        setClientSecret(json.clientSecret);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const onClickPay = async () => {
  //   if (!stripe) return;

  //   const userData = await axios.get(
  //     `http://localhost:3000/api/users?walletAddress=${account.address}`
  //   );

  //   // decrypt function to get cardinfo
  //   const decryptData = (encryptedData) => {
  //     SECRET_KEY = localStorage.getItem("user_id");

  //     if (!SECRET_KEY) {
  //       toast("DEC: No secret key found!");
  //       return;
  //     }
  //     const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  //     const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //     return decryptedData;
  //   };

  //   const decCardInfo = decryptData(userData.data.cardHash);
  //   console.log(decCardInfo);

  //   // setIsLoading(true);
  //   // try {
  //   //   const { paymentIntent, error } = await stripe.confirmPayment({
  //   //     elements,
  //   //     confirmParams: {
  //   //       return_url: "http://localhost:3001",
  //   //     },
  //   //     redirect: "if_required",
  //   //   });

  //   //   if (error) {
  //   //     throw error.message;
  //   //   }
  //   //   if (paymentIntent.status === "succeeded") {
  //   //     setIsComplete(true);
  //   //     alert("Payment complete!");
  //   //   }
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }
  // };

  const decryptData = (encryptedData) => {
    SECRET_KEY = localStorage.getItem("user_id");

    if (!SECRET_KEY) {
      toast("DEC: No secret key found!");
      return;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };

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
              <button
                className='bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 syne'
                onClick={() => {
                  const res = decryptData(
                    "U2FsdGVkX1+lWxK9BfsZPCKmdfT2m4AP1BhnulpxMSNszxQf1BBjWU442PgyP6LMGcgAl26V9LTad23tYM/7dZZbBTaS7MsGXHBZMGr2NT6ZtZtIp0dpvTVywgMAZ0Fus7QUd4Fsq+HPS5r9hD7uB+MZNspVEEa5uUihM2Rp20M="
                  );
                  console.log(res.cardInfo);
                }}
              >
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

            <div className='space-x-4 mt-[30px] flex flex-row items-center'>
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className={`bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 syne cursor-pointer transition ease-in-out duration-150`}
                    onClick={handlePay}
                  >
                    Pay with Stripe
                  </div>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className='mb-[20px] bricolage text-[26px]'>
                      Payment Page
                    </DialogTitle>
                    <DialogDescription>
                      {clientSecret ? (
                        <Elements
                          options={{
                            clientSecret: clientSecret,
                            appearance: { theme: "night" },
                          }}
                          stripe={stripe}
                        >
                          <CreditCardForm />
                        </Elements>
                      ) : (
                        <div className='w-full mt-[40px] flex items-center justify-center'>
                          <Loader2 className='h-6 w-6 animate-spin stroke-[#FF6B6B]' />
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <p className='syne opacity-50'>or</p>
              <button
                className='inline-flex h-9 items-center justify-center rounded-md border border-[#FF6B6B] bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B] outline-none syne'
                href='#'
              >
                Pay with Crypto
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

      <Footer />
    </div>
  );
};

export default ID;
