import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Footer from "./Footer";

const PaymentForm = () => {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardFocus, setCardFocus] = useState("");

  const handleCardNumberChange = (e) => {
    const value = e.currentTarget.value;

    const formattedCardNumber = value
      .replace(/\s/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ");

    setCardNumber(formattedCardNumber);
  };

  const handleExpiryChange = (e) => {
    const value = e.currentTarget.value;
    setCardExpiry(value);
  };

  const handleNameChange = (e) => {
    const value = e.currentTarget.value;
    setCardName(value);
  };

  const handleCVCChange = (e) => {
    const value = e.currentTarget.value;
    setCardCVC(value);
  };

  const handleInputFocus = (evt) => {
    setCardFocus(evt.target.name);
    // setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <>
      <div>
        <Cards
          number={cardNumber}
          expiry={cardExpiry}
          cvc={cardCVC}
          name={cardName}
          focused={cardFocus}
        />
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

          <div className='form-actions flex items-center justify-center w-full'>
            <Button
              // onClick={handleMintNFT}
              className='bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]/90 w-full syne text-[14px]'
            >
              Pay
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentForm;
