# Solana Contracts Template

Uses [Anchor](https://www.anchor-lang.com/docs) for programs and [Bankrun](https://github.com/kevinheavey/solana-bankrun) for testing

## Prerequisites

Rust lang:

```bash
rustc --version
rustc 1.79.0 (129f3b996 2024-06-10)
```

Anchor CLI:

```bash
anchor --version
anchor-cli 0.30.1
```

## Commands

```bash
# build
anchor build

# test
yarn test

# deploy
yarn syncProgramAddresses
anchor deploy --provider.cluster <mainnet or devnet>

# upgrade program if its keys are present in ./target/deploy
anchor deploy --provider.cluster <mainnet or devnet>
# else
anchor upgrade --program-id <program id> ./target/deploy/<program build file>.so --provider.cluster <mainnet or devnet>
```
