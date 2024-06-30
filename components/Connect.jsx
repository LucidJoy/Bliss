import React from "react";
import { ThirdwebProvider, ConnectButton, darkTheme } from "thirdweb/react";
import { sepolia, baseSepolia, defineChain } from "thirdweb/chains";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";
import { client } from "@/utils/client";
// import { createThirdwebClient } from "thirdweb";

// const client = createThirdwebClient({
//   clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
// });

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  // walletConnect(),
  // inAppWallet({
  //   auth: {
  //     options: ["email", "google", "apple", "facebook", "phone"],
  //   },
  // }),
];

const Connect = () => {
  return (
    <ConnectButton
      client={client}
      wallets={[inAppWallet()]}
      accountAbstraction={{
        chain: defineChain(baseSepolia),
        sponsorGas: true,
      }}
      connectButton={{
        style: {
          fontFamily: "syne",
        },
      }}
      theme={darkTheme({
        colors: {
          accentText: "#FF6B6B",
          accentButtonBg: "#FF6B6B",
          skeletonBg: "#FF6B6B",
          secondaryIconColor: "#FF6B6B",
          primaryButtonBg: "#FF6B6B",
          primaryButtonText: "#fff",
        },
      })}
    />
  );
};

export default Connect;
