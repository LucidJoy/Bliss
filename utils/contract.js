import { defineChain } from "thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { getContract } from "thirdweb";

export const nftCollectionContractAddress =
  "0xC6A1EC7dC587bE4c32087D21Ca36f7b549C079F7";

export const contract = getContract({
  client: client,
  chain: chain,
  address: nftCollectionContractAddress,
});
