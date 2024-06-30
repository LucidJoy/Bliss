import React, { useEffect, useRef, useState } from "react";
import Cards from "react-credit-cards-2";
import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { client } from "@/utils/client";

import "react-credit-cards-2/dist/es/styles-compiled.css";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useActiveAccount } from "thirdweb/react";

// import { encryptData, decryptData } from "./encryption";

const PaymentForm = () => {
  const activeAccount = useActiveAccount();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardFocus, setCardFocus] = useState("");

  // ------------- LOADING ---------------
  const [isSaveLoad, setIsSaveLoad] = useState(false);

  let SECRET_KEY = "";

  // encrypt function
  const encryptData = (data) => {
    SECRET_KEY = localStorage.getItem(
      `thirdwebEwsWalletUserId-${process.env.NEXT_PUBLIC_CLIENT_ID}`
    );

    if (!SECRET_KEY) {
      toast("ENC: No secret key found!");
      return;
    }

    const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);
    return cipher.toString();
  };

  // decrypt function
  const decryptData = (encryptedData) => {
    SECRET_KEY = localStorage.getItem(
      `thirdwebEwsWalletUserId-${process.env.NEXT_PUBLIC_CLIENT_ID}`
    );

    if (!SECRET_KEY) {
      toast("DEC: No secret key found!");
      return;
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };

  const handleCardNumberChange = (e) => {
    const value = e.currentTarget.value;

    const formattedCardNumber = value
      .replace(/\s/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ");

    setCardNumber(formattedCardNumber);
  };

  const handleNameChange = (e) => {
    const value = e.currentTarget.value;
    setCardName(value);
  };

  const handleExpiryChange = (e) => {
    const value = e.currentTarget.value;
    setCardExpiry(value);
  };

  const handleCVCChange = (e) => {
    const value = e.currentTarget.value;
    setCardCVC(value);
  };

  const handleInputFocus = (evt) => {
    setCardFocus(evt.target.name);
  };

  // upload to IPFS

  const [cardImg, setCardImg] = useState("");

  // const uploadData = async (e) => {
  //   e.preventDefault();

  //   const cardInfo = {
  //     number: cardNumber,
  //     name: cardName,
  //     expiry: cardExpiry,
  //     image: { card },
  //   };

  //   const encData = encryptData({ cardInfo });

  //   const fileData = new FormData();
  //   const content = new Blob([encData]);
  //   fileData.append("file", content);

  //   const responseData = await axios({
  //     method: "post",
  //     url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //     data: fileData,
  //     headers: {
  //       pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  //       pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });

  //   const fileUrl =
  //     "https://gateway.pinata.cloud/ipfs/" + responseData.data.IpfsHash;
  //   console.log(fileUrl);
  // };

  const handleSaveCard = async (e) => {
    e.preventDefault();

    setIsSaveLoad(true);

    let cardInfo = {
      number: cardNumber,
      name: cardName,
      expiry: cardExpiry,
      cvc: cardCVC,
      focus: cardFocus,
    };

    console.log(cardInfo);

    // encrypt the card details
    const encCardInfo = encryptData(cardInfo);

    // console.log("enc: ", encCardInfo);

    // upload walletaddress, walletid & cardHash to mongodb
    const currentThirdwebWalletAddr = activeAccount.address;
    const walletIdFromLocalStorage = localStorage.getItem(
      `thirdwebEwsWalletUserId-${process.env.NEXT_PUBLIC_CLIENT_ID}`
    );

    const userData = {
      walletAddress: currentThirdwebWalletAddr,
      walletId: walletIdFromLocalStorage,
      cardHash: encCardInfo,
    };

    console.log("User Data: ", userData);

    try {
      const response = await axios.post("/api/users", userData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data) {
        console.log(response.data);
        toast("Card saved successfully.");

        setIsSaveLoad(false);
        handleMintCardNFT();
      }
    } catch (error) {
      console.log(error.response.data.error);
      setIsSaveLoad(false);
      toast(error.response.data.error);
    }
  };

  const handleMintCardNFT = async () => {
    try {
      const res = await fetch("/api/mint-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: activeAccount?.address,
          cardImage:
            "https://www.visasoutheasteurope.com/dam/VCOM/regional/cemea/generic-cemea/pay-with-visa/find-a-card/visa-infinite-affluent-800x450.png",
        }),
      });

      if (res.ok) {
        toast("NFT Card Minted!");

        setIsSaveLoad(false);
        router.push("/");
      } else {
        const errorData = await res.json();
        console.error("Error minting NFT:", errorData);
        alert("Error minting NFT: " + (errorData.message || "Unknown error"));
        setIsSaveLoad(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsSaveLoad(false);
    } finally {
      setIsSaveLoad(false);
    }
  };

  return (
    <div>
      <div className='h-fit w-full'>
        <Cards
          number={cardNumber}
          expiry={cardExpiry}
          cvc={cardCVC}
          name={cardName}
          focused={cardFocus}
        />
      </div>

      {/* <button
        onClick={() => {
          const data = decryptData(
            "U2FsdGVkX1//3P+Fd4hz1yoR7ezx30jieqooA41NJARtYmPR4oMEB1H8rx3aIm6Yr+kf2Il141dtOrya0pFkXsLRvmadZRntli+ejTf7DAYVXezPqCu9JvO1yU4C7HyjnAxZOMihT4ymE59lORweEA=="
          );
          console.log(data);
        }}
      >
        userid
      </button> */}

      <form>
        <div className='mb-8 mt-8'>
          <label
            htmlFor='card-number-input'
            className='block font-medium mb-2 bricolage'
          >
            Card Number
          </label>

          <Input
            id='card-number-input'
            type='text'
            maxLength={19}
            placeholder='1234 5678 9012 3456'
            value={cardNumber}
            onInput={handleCardNumberChange}
            onFocus={handleInputFocus}
            className='w-full bg-[#3A3A3A] border-none form-control placeholder:text-white/30'
          />
        </div>

        <div className='form-group mb-8'>
          <label
            htmlFor='card-name'
            className='block font-medium mb-2 bricolage'
          >
            Cardholder Name
          </label>
          <Input
            id='card-name'
            type='text'
            placeholder='John Doe'
            value={cardName}
            required
            onInput={handleNameChange}
            className='w-full bg-[#3A3A3A] border-none form-control placeholder:text-white/30'
          />
        </div>

        <div className='flex flex-row w-full items-center justify-between mb-8'>
          <div className='w-[45%]'>
            <label
              htmlFor='card-exp'
              className='block font-medium mb-2 bricolage'
            >
              Expiry Date
            </label>
            <Input
              type='tel'
              name='card-exp'
              placeholder='MM/YY'
              pattern='\d\d/\d\d'
              maxLength={5}
              required
              onChange={handleExpiryChange}
              onFocus={handleInputFocus}
              className='w-full bg-[#3A3A3A] border-none form-control placeholder:text-white/30'
            />
          </div>

          <div className='w-[45%]'>
            <label
              htmlFor='card-cvc'
              className='block font-medium mb-2 bricolage'
            >
              CVC
            </label>
            <Input
              maxLength={3}
              type='text'
              name='card-cvc'
              className='form-control w-full bg-[#3A3A3A] border-none placeholder:text-white/30'
              placeholder='***'
              pattern='\d{3,4}'
              required
              onChange={handleCVCChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>

        <div className=' flex items-center justify-center w-full'>
          {isSaveLoad ? (
            <Button className='bg-[#FF6B6B] text-white w-full text-[14px] pointer-events-none'>
              <Loader2 className='h-6 w-6 animate-spin stroke-[#fff]' />
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                handleSaveCard(e);
              }}
              className='bg-[#FF6B6B] form-actions text-white hover:bg-[#FF6B6B]/90 w-full syne text-[14px]'
              disabled={
                !activeAccount ||
                cardNumber.length != 19 ||
                cardName.length == 0 ||
                cardExpiry.length != 5 ||
                cardCVC.length != 3
              }
            >
              Save
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
