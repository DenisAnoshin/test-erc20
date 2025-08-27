import * as fs from "fs";
import * as path from "path";
import { getAddress } from "viem";

export function loadDeployment() {
  const p = path.join(process.cwd(), "deployments", "local", "MyToken.json");
  if (fs.existsSync(p)) {
    const { address, abi } = JSON.parse(fs.readFileSync(p, "utf8"));
    return { address: getAddress(address), abi };
  }
  throw new Error("Deployment info not found.");
}



