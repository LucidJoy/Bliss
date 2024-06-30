"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { upload } from "thirdweb/storage";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import AskAIBtn from "@/components/AskAIBtn";
import { cn } from "@/utils/cn";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/utils/client";

export default function Component() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

  // NFT by prompt
  const [isPromptNFT, setIsPromptNFT] = useState(false);
  const [generatedImageByPrompt, setGeneratedImageByPrompt] = useState(null);
  const [geneatePromptWObase64, setGeneatePromptWObase64] = useState("");
  const [generatePromptDesc, setGeneratePromptDesc] = useState("");

  // NFT by trend
  const [isTrendNFT, setIsTrendNFT] = useState(false);
  const [generateTrendImage, setGenerateTrendImage] = useState("");
  const [generateTrendingName, setGenerateTrendingName] = useState("");
  const [generateTrendPrice, setGenerateTrendPrice] = useState("");
  const [generateTrendDesc, setGenerateTrendDesc] = useState("");
  const [generateImgWithoutBase64, setGenerateImgWithoutBase64] = useState("");

  const [aiImgLoader, setAiImgLoader] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [isGenerateByTrendLoader, setIsGenerateByTrendLoader] = useState(false);

  const [isUserEditing, setIsUserEditing] = useState(false);

  const activeAccount = useActiveAccount();
  const router = useRouter();

  const handleImageUpload = (e) => {
    // setImage(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  // Function to convert Base64 to a PNG file
  function base64ToPngFile(base64, fileName) {
    // Decode the Base64 string
    const byteString = atob(base64);

    // Create an array buffer to hold the binary data
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    // Populate the array buffer with the binary data
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    // Create a Blob from the array buffer
    const blob = new Blob([uint8Array], { type: "image/png" });

    // Create a File from the Blob
    const file = new File([blob], fileName, { type: "image/png" });

    return file;
  }

  const handleMintNFT = async () => {
    setIsMinting(true);
    setIsMinted(false);

    try {
      // const response = await axios.post(
      //   "https://ef52-43-241-194-181.ngrok-free.app/generate-image"
      // );
      // const base64String = response.data.image_url.data[0].b64_json;
      // console.log(base64String);
      const fileName = "image.png";
      // const pngFile = base64ToPngFile(generateImgWithoutBase64, fileName);
      let pngFile;
      if (isPromptNFT == true) {
        pngFile = base64ToPngFile(geneatePromptWObase64, fileName);
      } else if (isTrendNFT == true) {
        pngFile = base64ToPngFile(generateImgWithoutBase64, fileName);
      }

      const imageUri = await upload({
        client: client,
        files: [pngFile],
      });

      const res = await fetch("/api/mint-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImage: imageUri,
          address: activeAccount.address,
          name: generateTrendingName || name,
          desc: generateTrendDesc || generatePromptDesc || 0,
          price: generateTrendPrice || price || 0,
        }),
      });

      if (res.ok) {
        toast("NFT Minted!");

        setIsPromptNFT(false);
        setIsTrendNFT(false);
        router.push("/");
      } else {
        const errorData = await res.json();
        console.error("Error minting NFT:", errorData);
        alert("Error minting NFT: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      setIsMinting(false);
      setIsMinted(true);
    }
  };

  const handleAiPromptSubmit = async () => {
    try {
      setAiImgLoader(true);
      const res = await axios.post(
        "https://7668-43-241-194-181.ngrok-free.app/generate-image",
        {
          prompt: aiPrompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        }
      );
      console.log(res.data);
      setAiImgLoader(false);
      res.data && setShowAiModal(false);
      res.data && toast("NFT generated successfully.");

      const base64String = res.data.image_url.data[0].b64_json;
      const base64Img = `data:image/png;base64,${base64String}`;

      setGeneratedImageByPrompt(base64Img);
      setGeneatePromptWObase64(base64String);
      setGeneratePromptDesc(res.data.image_url.data[0].revised_prompt);
      setIsPromptNFT(true);
    } catch (error) {
      console.log(error);
      setShowAiModal(false);
    }
  };

  const handleGenerateByTrend = async () => {
    try {
      setIsGenerateByTrendLoader(true);
      const res = await axios.post(
        "https://7668-43-241-194-181.ngrok-free.app/generate-image"
      );
      console.log(res.data.image_url);

      res.data && setShowAiModal(false);
      // res.data && setGeneratedImageByPrompt(res.data.image_url);
      res.data && toast("NFT generated successfully.");

      setIsGenerateByTrendLoader(false);

      const base64String = res.data.image_url.data[0].b64_json;
      const base64Img = `data:image/png;base64,${base64String}`;
      setGenerateTrendImage(base64Img);
      setGenerateImgWithoutBase64(base64String);
      setGenerateTrendingName(res.data.name);
      setGenerateTrendPrice(res.data.price);
      setGenerateTrendDesc(res.data.image_url.data[0].revised_prompt);
      setIsTrendNFT(true);
      setShowAiModal(false);
    } catch (error) {
      console.log(error);
      setShowAiModal(false);
      setIsGenerateByTrendLoader(false);
    }
  };

  useEffect(() => {
    if (generateTrendingName && !isUserEditing) {
      setName(generateTrendingName);
    }
  }, [generateTrendingName, isUserEditing]);

  const handleNameChange = (e) => {
    setName(e.target.value);

    setIsUserEditing(true); // User started editing
  };

  return (
    <div className='flex flex-col min-h-[100dvh] bg-[#1e1e1e]'>
      <Navbar />
      <Separator />

      <main className='flex-1'>
        <section className='py-20 px-6'>
          <div className='container mx-auto max-w-2xl'>
            <h2 className='text-4xl font-bold mb-8 bricolage'>
              Create a new NFT
            </h2>
            <div className='bg-[#2C2C2C] rounded-lg p-8 shadow-lg'>
              <div className='mb-8'>
                <label
                  htmlFor='image'
                  className='block font-medium mb-2 bricolage'
                >
                  Upload Image
                </label>
                <div className='flex items-center justify-center w-full'>
                  <label
                    htmlFor='dropzone-file'
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-[315px] border-2 border-dashed rounded-lg cursor-pointer hover:bg-[#3c3c3c]/90 bg-[#3C3C3C] border-[#FF6B6B]",
                      image ||
                        (generatedImageByPrompt && "p-[10px] h-fit w-fit") ||
                        (generateTrendImage && "p-[10px] h-fit w-fit")
                    )}
                  >
                    {image && (
                      <Image
                        src={image}
                        alt='Uploaded Image'
                        width={300}
                        height={300}
                        className='object-contain rounded-md'
                      />
                    )}

                    {generatedImageByPrompt && (
                      <Image
                        src={generatedImageByPrompt}
                        alt='Uploaded Image'
                        width={300}
                        height={300}
                        className='object-contain rounded-md'
                      />
                    )}

                    {generateTrendImage && (
                      <Image
                        src={generateTrendImage}
                        alt='Trend Image'
                        width={300}
                        height={300}
                        className='object-contain rounded-md'
                      />
                    )}

                    {image == null &&
                      !generatedImageByPrompt &&
                      !generateTrendImage && (
                        <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                          <CloudUploadIcon className='w-10 h-10 text-gray-400' />
                          <p className='mb-2 text-sm text-gray-400 syne'>
                            <span className='font-semibold'>
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className='text-xs text-gray-400 syne'>
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      )}
                    <input
                      id='dropzone-file'
                      type='file'
                      className='hidden'
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className='mb-8 w-full flex items-center justify-center'>
                <div className='w-fit' onClick={() => setShowAiModal(true)}>
                  <AskAIBtn text='Ask AI to generate a NFT' />
                </div>
              </div>

              <div className='mb-8'>
                <label
                  htmlFor='name'
                  className='block font-medium mb-2 bricolage'
                >
                  Name
                </label>
                <Input
                  id='name'
                  type='text'
                  value={name}
                  onChange={handleNameChange}
                  placeholder='Enter NFT name'
                  className='w-full bg-[#3A3A3A] border-none syne placeholder:text-white/50 placeholder:syne'
                />
              </div>

              <div className='mb-8'>
                <label
                  htmlFor='price'
                  className='block font-medium mb-2 bricolage'
                >
                  Price (ETH)
                </label>
                <Input
                  id='price'
                  type='number'
                  value={generateTrendPrice ? generateTrendPrice : price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  placeholder='Enter NFT price'
                  className='w-full bg-[#3A3A3A] border-none'
                />
              </div>
              <div className='flex items-center justify-center'>
                <Button
                  onClick={() => handleMintNFT()}
                  className='bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]/90'
                  disabled={isMinting}
                >
                  Mint NFT
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle className='bricolage'>Ask AI</DialogTitle>
            <DialogDescription className='syne text-white/60'>
              Enter your prompt and we'll generate a response.
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col w-full items-center justify-center gap-[10px]'>
            <div className='grid gap-4 w-full'>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder='Enter your prompt...'
                className='min-h-[100px] bg-back_black'
              />

              {aiImgLoader ? (
                <Button className='bg-[#FF6B6B] text-white w-full text-[14px] pointer-events-none'>
                  <Loader2 className='h-6 w-6 animate-spin stroke-[#fff]' />
                </Button>
              ) : (
                <Button
                  onClick={handleAiPromptSubmit}
                  className='bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]/90 syne'
                >
                  Submit
                </Button>
              )}
            </div>

            <p className='syne opacity-50'>or</p>

            {isGenerateByTrendLoader ? (
              <Button className='bg-transparent text-white w-full text-[14px] pointer-events-none'>
                <Loader2 className='h-6 w-6 animate-spin stroke-[#fff]' />
              </Button>
            ) : (
              <AskAIBtn
                text='Generate a trending NFT'
                func={handleGenerateByTrend}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CloudUploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242' />
      <path d='M12 12v9' />
      <path d='m16 16-4-4-4 4' />
    </svg>
  );
}

function DiamondIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z' />
    </svg>
  );
}
