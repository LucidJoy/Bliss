import "@/styles/globals.css";
import { ThirdwebProvider } from "thirdweb/react";

export default function App({ Component, pageProps }) {
  return (
    <ThirdwebProvider>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
