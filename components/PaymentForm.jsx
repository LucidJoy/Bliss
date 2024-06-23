import React, { useEffect, useRef, useState } from "react";
import Cards from "react-credit-cards-2";
import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    SECRET_KEY = localStorage.getItem("user_id");

    if (!SECRET_KEY) {
      toast("ENC: No secret key found!");
      return;
    }
    const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);
    return cipher.toString();
  };

  // decrypt function
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
  const uploadData = async () => {
    const cardInfo = {
      number: cardNumber,
      name: cardName,
      expiry: cardExpiry,
      cvc: cardCVC,
      focus: cardFocus,
    };

    const encData = encryptData({ cardInfo });

    const fileData = new FormData();
    const content = new Blob([encData]);
    fileData.append("file", content);

    const responseData = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: fileData,
      headers: {
        pinata_api_key: "0cb51fecc4820f49a32a",
        pinata_secret_api_key:
          "72f31cd360ddbcc84948693dfe109cb19473c9df29f9edf8f0e76a3176e14f0b",
        "Content-Type": "multipart/form-data",
      },
    });

    const fileUrl =
      "https://gateway.pinata.cloud/ipfs/" + responseData.data.IpfsHash;
    console.log(fileUrl);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();

    let cardInfo = {
      number: cardNumber,
      name: cardName,
      expiry: cardExpiry,
      cvc: cardCVC,
      focus: cardFocus,
    };

    // encrypt the card details
    const encCardInfo = encryptData(cardInfo);

    // upload walletaddress, walletid & cardHash to mongodb
    const currentThirdwebWalletAddr = activeAccount.address;
    const walletIdFromLocalStorage = localStorage.getItem("user_id");

    const userData = {
      walletAddress: currentThirdwebWalletAddr,
      walletId: walletIdFromLocalStorage,
      cardHash: encCardInfo,
    };

    console.log(userData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users",
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data) {
        console.log(response.data);
        toast("Card saved successfully.");
      }
    } catch (error) {
      console.log(error.response.data.error);
      toast(error.response.data.error);
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
            <div className='bg-[#FF6B6B] text-white w-full syne text-[14px]'>
              <Loader2 className='h-6 w-6 animate-spin stroke-[#fff]' />
            </div>
          ) : (
            <Button
              onClick={(e) => handleSaveCard(e)}
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
