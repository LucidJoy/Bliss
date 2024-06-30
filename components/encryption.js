"use client";

import React, { useEffect } from "react";
import CryptoJS from "crypto-js";
import { toast } from "sonner";

// A secret key for encryption and decryption
const SECRET_KEY = window.localStorage.getItem(
  `thirdwebEwsWalletUserId-${process.env.NEXT_PUBLIC_CLIENT_ID}`
);

// Function to encrypt data
export const encryptData = (data) => {
  if (!SECRET_KEY) {
    toast.error("Secret key not found.");
    return;
  }
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY);
  return cipher.toString();
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
  if (!SECRET_KEY) {
    toast.error("Secret key not found.");
    return;
  }
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
