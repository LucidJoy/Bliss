import "@/styles/globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ThirdwebProvider as ThirdwebReact } from "@thirdweb-dev/react";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider>
      <ThirdwebReact clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
        <Head>
          <title>ONCHAIN SUMMER</title>
        </Head>

        <Toaster />
        <Component {...pageProps} />
      </ThirdwebReact>
    </ThirdwebProvider>
  );
}
