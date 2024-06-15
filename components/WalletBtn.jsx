import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const WalletBtn = () => {
  const [isClicked, setIsClicked] = React.useState(false);

  const router = useRouter();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Adjust duration as needed
    router.push("/wallet");
  };

  const buttonVariants = {
    initial: { translateY: 0 }, // Start at its original position
    clicked: {
      translateY: 2, // Move down 5 pixels (adjust for desired movement)
      transition: { duration: 0.01 }, // Adjust duration for animation speed
    },
  };

  return (
    <motion.button
      className='p-[14px] px-[16px] bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 transition duration-150 ease-in-out rounded-[12px] font-semibold text-white flex items-center justify-center gap-[8px] text-[16px] syne'
      variants={buttonVariants}
      animate={isClicked ? "clicked" : "initial"}
      onClick={handleClick}
    >
      <p>Wallet</p>
      {/* <SquarePen height={20} width={20} /> */}
    </motion.button>
  );
};

export default WalletBtn;
