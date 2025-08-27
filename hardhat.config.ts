/// <reference types="node" />
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const { RPC_URL, PRIVATE_KEY } = process.env as Record<string, string | undefined>;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    hardhat: { chainId: 31337 },
    localhost: {
      url: RPC_URL || "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined
    }
  }
};

export default config;


