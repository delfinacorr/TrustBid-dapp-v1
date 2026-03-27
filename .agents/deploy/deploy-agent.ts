/**
 * Deploy Agent
 * Automates contract deployment and post-deployment verification.
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface DeployConfig {
  network: "localhost" | "sepolia" | "mainnet";
  verify: boolean;
}

async function deploy(config: DeployConfig) {
  console.log(`[deploy-agent] Deploying to ${config.network}...`);

  try {
    const cmd = `pnpm --filter @trustbid/contracts deploy:${config.network}`;
    const output = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
    console.log(output);

    const addressMatch = output.match(/TrustBid deployed to: (0x[a-fA-F0-9]{40})/);
    if (!addressMatch) throw new Error("Could not parse deployed address");

    const contractAddress = addressMatch[1];
    console.log(`[deploy-agent] Contract address: ${contractAddress}`);

    updateEnvFile(config.network, contractAddress);

    if (config.verify && config.network !== "localhost") {
      console.log("[deploy-agent] Verifying on Etherscan...");
      execSync(
        `pnpm --filter @trustbid/contracts exec hardhat verify --network ${config.network} ${contractAddress} 250`,
        { stdio: "inherit" }
      );
    }

    console.log("[deploy-agent] Done.");
  } catch (err) {
    console.error("[deploy-agent] Error:", err);
    process.exit(1);
  }
}

function updateEnvFile(network: string, address: string) {
  const envPath = path.resolve(__dirname, "../../apps/web/.env.local");
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

  const key = "NEXT_PUBLIC_TRUSTBID_ADDRESS";
  if (content.includes(key)) {
    content = content.replace(new RegExp(`${key}=.*`), `${key}=${address}`);
  } else {
    content += `\n${key}=${address}\n`;
  }

  fs.writeFileSync(envPath, content);
  console.log(`[deploy-agent] Updated ${envPath} with address ${address}`);
}

const args = process.argv.slice(2);
const network = (args[0] as DeployConfig["network"]) ?? "localhost";
const verify = args.includes("--verify");

deploy({ network, verify });
