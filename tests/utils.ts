import * as anchor from "@coral-xyz/anchor";
import { Account, unpackAccount } from "@solana/spl-token";
import { BankrunProvider } from "anchor-bankrun";
import {
  BanksClient,
  BanksTransactionMeta,
  ProgramTestContext,
} from "solana-bankrun";

export const TEST_WALLETS_BALANCE = 1000 * anchor.web3.LAMPORTS_PER_SOL;

export const testWallets = {
  test: new anchor.Wallet(anchor.web3.Keypair.generate()),
};
export type TestWalletLabel = keyof typeof testWallets;

export async function genWalletProviders(
  defaultProvider: BankrunProvider
): Promise<Record<TestWalletLabel, BankrunProvider>> {
  const tx = new anchor.web3.Transaction();
  const providers: Record<string, BankrunProvider> = {};

  for (const walletLabel in testWallets) {
    tx.add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: defaultProvider.publicKey,
        toPubkey: testWallets[walletLabel].publicKey,
        lamports: TEST_WALLETS_BALANCE,
      })
    );
    providers[walletLabel] = new BankrunProvider(
      defaultProvider.context,
      testWallets[walletLabel]
    );
  }

  await defaultProvider.sendAndConfirm(tx);
  return providers;
}

export async function getTokenAccountData(
  client: BanksClient,
  address: anchor.web3.PublicKey
): Promise<Account> {
  const rawData = await client.getAccount(address);
  const data = unpackAccount(
    address,
    rawData as anchor.web3.AccountInfo<Buffer>
  );

  return data;
}

export async function processTx(
  context: ProgramTestContext,
  tx: anchor.web3.Transaction,
  feePayer: anchor.web3.PublicKey,
  signers: anchor.web3.Keypair[]
): Promise<BanksTransactionMeta> {
  tx.recentBlockhash = context.lastBlockhash;
  tx.feePayer = feePayer;
  tx.sign(...signers);

  const txResult = await context.banksClient.processTransaction(tx);
  return txResult;
}
