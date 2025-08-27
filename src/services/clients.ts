import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";

export const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(RPC_URL)
});

export const account = (() => {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) return null;
  try {
    // Ensure hex-prefixed private key type for viem
    if (!pk.startsWith("0x")) return null;
    return privateKeyToAccount(pk as `0x${string}`);
  } catch {
    return null;
  }
})();

export const walletClient = account
  ? createWalletClient({ account, chain: hardhat, transport: http(RPC_URL) })
  : null;


