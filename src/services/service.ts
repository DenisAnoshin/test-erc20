import { Abi, formatUnits, getAddress, parseUnits } from "viem";
import { publicClient, walletClient } from "./clients";
import { loadDeployment } from "./deployment";

const deployment = loadDeployment() as { address: `0x${string}`; abi: Abi };

let decimalsCache: number | null = null;
async function getDecimals(): Promise<number> {
  if (decimalsCache !== null) return decimalsCache;
  const value = await publicClient.readContract({ address: deployment.address, abi: deployment.abi, functionName: "decimals", args: [] });
  decimalsCache = value as number;
  return decimalsCache;
}

export async function getTokenInfo() {
  const { address, abi } = deployment;
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    publicClient.readContract({ address, abi, functionName: "name", args: [] }),
    publicClient.readContract({ address, abi, functionName: "symbol", args: [] }),
    publicClient.readContract({ address, abi, functionName: "decimals", args: [] }),
    publicClient.readContract({ address, abi, functionName: "totalSupply", args: [] })
  ] as const);
  return {
    address,
    name,
    symbol,
    decimals,
    totalSupply: (totalSupply as bigint).toString(),
    totalSupplyFormatted: formatUnits(totalSupply as bigint, decimals as number)
  };
}

export async function getBalance(address: string) {
  const user = getAddress(address);
  const [decimals, balance] = await Promise.all([
    getDecimals(),
    publicClient.readContract({ address: deployment.address, abi: deployment.abi, functionName: "balanceOf", args: [user] })
  ] as const);
  return {
    address: user,
    balance: (balance as bigint).toString(),
    balanceFormatted: formatUnits(balance as bigint, decimals as number)
  };
}

export async function approveSpender(spender: string, amount: string | number) {
  if (!walletClient) throw new Error("Server wallet not configured (set PRIVATE_KEY)");
  const spenderAddr = getAddress(spender);
  const decimals = await getDecimals();
  const value = parseUnits(String(amount), decimals);
  const hash = await walletClient.writeContract({ address: deployment.address, abi: deployment.abi, functionName: "approve", args: [spenderAddr, value] });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { hash, status: receipt.status };
}

export async function transferFrom(from: string, to: string, amount: string | number) {
  if (!walletClient) throw new Error("Server wallet not configured (set PRIVATE_KEY)");
  const fromAddr = getAddress(from);
  const toAddr = getAddress(to);
  const decimals = await getDecimals();
  const value = parseUnits(String(amount), decimals);
  const hash = await walletClient.writeContract({ address: deployment.address, abi: deployment.abi, functionName: "transferFrom", args: [fromAddr, toAddr, value] });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { hash, status: receipt.status };
}

export async function transfer(to: string, amount: string | number) {
  if (!walletClient) throw new Error("Server wallet not configured (set PRIVATE_KEY)");
  const toAddr = getAddress(to);
  const decimals = await getDecimals();
  const value = parseUnits(String(amount), decimals);
  const hash = await walletClient.writeContract({ address: deployment.address, abi: deployment.abi, functionName: "transfer", args: [toAddr, value] });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { hash, status: receipt.status };
}

export async function mint(to: string, amount: string | number) {
  if (!walletClient) throw new Error("Server wallet not configured (set PRIVATE_KEY)");
  const toAddr = getAddress(to);
  const decimals = await getDecimals();
  const value = parseUnits(String(amount), decimals);
  const hash = await walletClient.writeContract({ address: deployment.address, abi: deployment.abi, functionName: "mint", args: [toAddr, value] });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { hash, status: receipt.status };
}


