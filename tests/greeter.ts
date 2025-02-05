import * as anchor from "@coral-xyz/anchor";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { ProgramTestContext } from "solana-bankrun";
import idl from "../target/idl/greeter.json";
import { Greeter } from "../target/types/greeter";
import { genWalletProviders, processTx, TestWalletLabel } from "./utils";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

const GREETING_ACCOUNT_SEED_PHRASE = "greeting";

describe("greeter", () => {
  let bankrunContext: ProgramTestContext;
  let defaultProvider: BankrunProvider;
  let walletProviders: Record<TestWalletLabel, BankrunProvider>;

  let greeter: anchor.Program<Greeter>;

  let greeterAccount = anchor.web3.PublicKey.default;

  beforeEach(async () => {
    bankrunContext = await startAnchor("", [], []);
    defaultProvider = new BankrunProvider(bankrunContext);
    walletProviders = await genWalletProviders(defaultProvider);

    greeter = new anchor.Program<Greeter>(idl as Greeter, defaultProvider);

    greeterAccount = (
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(GREETING_ACCOUNT_SEED_PHRASE)],
        greeter.programId
      )
    )[0];
  });

  describe("set_greeting", () => {
    context("greeting of zero length", () => {
      it("should revert with GreeterZeroLengthGreeting", async () => {
        const greetingStr = "";

        await expect(
          greeter.methods
            .setGreeting(greetingStr)
            .accounts({ signer: defaultProvider.publicKey })
            .rpc()
        ).to.be.rejectedWith("GreeterZeroLengthGreeting");
      });
    });

    context("greeting string too long", () => {
      it("should revert due to size violation", async () => {
        const maxLen = 50;
        const greetingStrNormal = "Hello";
        const greetingStrLong = greetingStrNormal.repeat(
          maxLen / greetingStrNormal.length + 1
        );

        await expect(
          greeter.methods
            .setGreeting(greetingStrLong)
            .accounts({ signer: defaultProvider.publicKey })
            .rpc()
        ).to.be.rejected;
      });
    });

    context("correct call", () => {
      it("should change greeting", async () => {
        const greetingStr = "Hello";

        const tx = await greeter.methods
          .setGreeting(greetingStr)
          .accounts({ signer: defaultProvider.publicKey })
          .transaction();
        const txResult = await processTx(
          bankrunContext,
          tx,
          defaultProvider.publicKey,
          [defaultProvider.wallet.payer]
        );
        expect(txResult.logMessages).to.include(
          `Program log: Changing greeting from "" to "${greetingStr}"`
        );

        const greetingData = await greeter.account.greetingData.fetch(
          greeterAccount
        );
        expect(greetingData.greeting).to.equal(greetingStr);
      });
    });
  });
});
