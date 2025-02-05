import * as anchor from "@coral-xyz/anchor";
import idl from "../target/idl/greeter.json";
import { Greeter } from "../target/types/greeter";

async function main() {
  const cluster = process.env.CLUSTER;
  const greetingStr = process.env.GREETING;
  if (!cluster || !greetingStr)
    throw new Error("Env variables CLUSTER or GREETING were not set");

  process.env.ANCHOR_WALLET =
    process.env.ANCHOR_WALLET !== undefined
      ? process.env.ANCHOR_WALLET
      : `${process.env.HOME}/.config/solana/id.json`;
  const defaultProvider = anchor.AnchorProvider.local(
    anchor.web3.clusterApiUrl(cluster as anchor.web3.Cluster)
  );
  const greeter = new anchor.Program<Greeter>(idl as Greeter, defaultProvider);

  console.log(`Setting greeting: ${greetingStr}`);
  const tx = await greeter.methods
    .setGreeting(greetingStr)
    .accounts({ signer: defaultProvider.publicKey })
    .rpc();
  console.log(`Tx signature: ${tx}`);
}

main();
