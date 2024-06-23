import "@/styles/globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider>
      <Head>
        <title>ONCHAIN SUMMER</title>
      </Head>

      <Toaster />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
