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
import { useRouter } from "next/router";
import { TrendingUpIcon, Loader2 } from "lucide-react";
import { Line } from "react-chartjs-2";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

import { contract } from "@/utils/contract";
import { client } from "@/utils/client";
import { Badge } from "@/components/ui/badge";
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
} from "@stripe/react-stripe-js";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import axios from "axios";
import { toast } from "sonner";
import stars_or from "../../assets/stars_or.svg";
import Image from "next/image";

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
        toast.success("Payment & NFT transferred complete");
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

        <div className='flex flex-row items-center justify-between mt-[15px] mb-[20px]'>
          <Button
            className='bg-[#31313D] syne w-[200px] rounded-[5px] border border-[#424353] text-white hover:bg-[#31313d]/80 text-[14px]'
            onClick={() => handleCopy("num")}
          >
            Card Number
          </Button>
          <Button
            className='bg-[#31313D] syne w-[200px] rounded-[5px] border border-[#424353] text-white hover:bg-[#31313d]/80 text-[14px]'
            onClick={() => handleCopy("exp")}
          >
            Card Expiry
          </Button>
          {/* <Button
            className='bg-[#31313D] syne w-[140px] rounded-[5px] border border-[#424353] text-white hover:bg-[#31313d]/80 text-[14px]'
            onClick={() => handleCopy("cvc")}
          >
            Card CVC
          </Button> */}
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
            Pay
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

  const router = useRouter();
  const { image, name, description, price, tokenId } = router.query;

  const dataGraph = {
    labels: ["May", "June"],
    datasets: [
      {
        label: "ETH",
        data: [0, price], //PRICES
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

  // const stripe = loadStripe(
  //   "pk_test_51K6zdpSJoWGgDvdeIGGXPCauuK2nTyMK1pnQTaQHpNFzDxAaIyEE0XKTu1JMm9v0ha9NscfjjyQ1KbSP9aIMepS800yVO8nvZM"
  // );
  const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const { mutate: sendTransaction } = useSendTransaction();
  const { data, isLoading } = useReadContract({
    contract: contract,
    method: "function ownerOf(uint256 tokenId) view returns (address)",
    params: [tokenId],
  });

  const handleTransferNFT = () => {
    const transaction = prepareContractCall({
      contract,
      method:
        "function transferFrom(address from, address to, uint256 tokenId)",
      params: [data, account?.address, tokenId],
    });
    sendTransaction(transaction);
  };

  const handleApprove = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function approve(address to, uint256 tokenId)",
      params: ["0x9B0a0e0E2d3ED3E813D47e580d287F94C3d191fF", tokenId],
    });
    sendTransaction(transaction);
    console.log(transaction);
  };

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

        // toast.success("Payment success, transferring NFT");
        handleTransferNFT(data, account?.address);
      }
    } catch (error) {
      console.log(error);
      toast.error("Wrong");
    }
  };

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

      {/* <button
        // onClick={() => console.log("FROM: ", data, "TO: ", account?.address)}
        onClick={() => handleSetOwner()}
      >
        owners
      </button> */}

      <div className='flex flex-row bg-[#1e1e1e]'>
        <div className='flex-1 flex flex-col gap-[40px] items-center justify-center mt-[100px]'>
          <div className='relative w-[500px] h-[500px] overflow-hidden rounded-[10px]'>
            <div className='absolute bg-gradient-to-br from-[#FF6B6B] to-[#8B5CF6]' />
            <MediaRenderer
              client={client}
              src={image}
              style={{
                width: "500px",
                height: "500px",
                aspectRatio: "500/500",
                objectFit: "cover",
                borderRadius: "8px",
                zIndex: 10,
              }}
            />
          </div>

          <div className='grid gap-4 mb-[20px]'>
            <div className='bg-[#2C2C2C] w-[500px] rounded-lg p-4 flex flex-col items-center justify-center space-y-2'>
              <div className='text-sm font-medium bricolage'>{name}</div>
              <div className='text-gray-300 text-sm syne'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum
                doloremque error inventore similique aliquam quo. A, at
                necessitatibus.
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <TrendingUpIcon className='h-5 w-5 text-[#FF6B6B]' />
              <div className='text-sm font-medium text-[#FF6B6B] syne'>
                Trending
              </div>
            </div>
          </div>
        </div>

        <div className='flex-1 flex items-start mt-[100px] justify-center'>
          <div>
            <Badge variant='badge' className='tracking-wide'>
              <div className='flex flex-row items-center justify-center gap-[5px] py-[2px]'>
                <Image
                  src={stars_or}
                  className='h-[12px] w-[12px]'
                  style={{
                    stroke: "#ff6b6b",
                    fill: "#ff6b6b",
                  }}
                />
                <p className='text-[12px]'>Enhanced by AI</p>
              </div>
            </Badge>

            <h1 className='bricolage text-6xl font-bold tracking-tight mt-[10px]'>
              {name}
            </h1>
            <p className='mx-auto max-w-[650px] text-[#D1D5DB] text-[16px] mt-[10px] syne'>
              {description}
            </p>

            <div className='flex flex-row gap-[10px] items-baseline mt-[20px]'>
              <p className='bricolage text-2xl font-semibold tracking-tight'>
                Price :
              </p>
              <p className='bricolage text-xl font-semibold tracking-tight'>
                {price} ETH
              </p>
            </div>

            <div className='space-x-4 mt-[30px] flex flex-row items-center'>
              {data == account?.address ? (
                <>
                  <div
                    className='inline-flex h-9 items-center justify-center rounded-md border border-[#FF6B6B] bg-transparent px-4 py-2 text-sm font-medium shadow-sm select-none outline-none syne'
                    onClick={() => handleApprove()}
                  >
                    You own this NFT
                  </div>
                </>
              ) : (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        className={`bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-3 syne cursor-pointer transition ease-in-out duration-150`}
                        onClick={handlePay}
                        // onClick={() => handleApprove()}
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
                  <button className='inline-flex h-9 items-center justify-center rounded-md border border-[#FF6B6B] bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-[#FF6B6B]/20 hover:text-[#FF6B6B] outline-none syne'>
                    Pay with Crypto
                  </button>
                </>
              )}
            </div>

            <div className='mt-8 mb-4'>
              <Separator />
            </div>

            <div className='flex flex-col items-start justify-center gap-[10px]'>
              <div className='bricolage tracking-tight font-semibold text-[28px]'>
                Price History
              </div>
              <div className=' bg-[#2C2C2C] rounded-lg p-4 max-w-[400px]'>
                <Line data={dataGraph} options={options} />
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
