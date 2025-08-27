/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import "@nomicfoundation/hardhat-toolbox";
import { ethers, artifacts } from "hardhat";

async function main(): Promise<void> {
  const initialSupply = ethers.parseUnits("1000000", 18);
  const name = process.env.TOKEN_NAME || "MyToken";
  const symbol = process.env.TOKEN_SYMBOL || "MTK";

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(name, symbol, initialSupply);
  await token.waitForDeployment();

  const address = await token.getAddress();
  const chainId = Number((await ethers.provider.getNetwork()).chainId);

  console.log(`Deployed ${name} (${symbol}) to`, address, "chainId:", chainId);

  const artifact = await artifacts.readArtifact("MyToken");

  const outDir = path.join(process.cwd(), "deployments", "local");
  fs.mkdirSync(outDir, { recursive: true });

  const output = {
    contract: "MyToken",
    address,
    chainId,
    abi: artifact.abi
  };
  const outfile = path.join(outDir, "MyToken.json");
  fs.writeFileSync(outfile, JSON.stringify(output, null, 2));
  console.log("Saved deployment to", outfile);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


