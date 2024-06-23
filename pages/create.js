"use client";

import { useState, useEffect } from "react";
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
import Image from "next/image";
import { cn } from "@/utils/cn";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Component() {
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);

  const [aiImgLoader, setAiImgLoader] = useState(false);

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

  const handleMintNFT = () => {
    console.log("Minting NFT:", { image, name, price });
  };

  const handleAiPromptSubmit = async () => {
    try {
      setAiImgLoader(true);
      const res = await axios.post(
        "https://5dd0-43-241-193-11.ngrok-free.app/generate-image",
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
      res.data && setGeneratedImage(res.data.image_url);
      res.data && toast("NFT generated successfully.");
    } catch (error) {
      console.log(error);
      setShowAiModal(false);
    }
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
                      image || (generatedImage && "p-[10px] h-fit w-fit")
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

                    {generatedImage && (
                      <Image
                        src={generatedImage}
                        alt='Uploaded Image'
                        width={300}
                        height={300}
                        className='object-contain rounded-md'
                      />
                    )}

                    {image == null && !generatedImage && (
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <CloudUploadIcon className='w-10 h-10 text-gray-400' />
                        <p className='mb-2 text-sm text-gray-400 syne'>
                          <span className='font-semibold'>Click to upload</span>{" "}
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
                  <AskAIBtn createPage={true} />
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter NFT name'
                  className='w-full bg-[#3A3A3A] border-none syne'
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
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  placeholder='Enter NFT price'
                  className='w-full bg-[#3A3A3A] border-none'
                />
              </div>
              <div className='flex items-center justify-center'>
                <Button
                  onClick={handleMintNFT}
                  className='bg-[#FF6B6B] text-white hover:bg-[#FF6B6B]/90'
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
            <DialogTitle>Ask AI</DialogTitle>
            <DialogDescription className='syne'>
              Enter your prompt and we'll generate a response.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4'>
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
