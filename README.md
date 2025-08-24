# Marriage Certificate on Flow (Cadence)

A resource‑oriented Cadence contract `Marriage` that mints a pair of marriage certificate resources (NFT‑like) and deposits one into each spouse’s account as on‑chain proof of marriage.

## Features

- Store metadata: spouse names, wedding date, vows, location, optional officiant, URI
- Mint as a pair: a single call mints two certificates sharing the same `marriageId`
- Each account holds a `Collection` and exposes a public read capability

## Structure

```
cadence/
  contracts/Marriage.cdc
  transactions/
    setup_account.cdc
    mint_pair.cdc
  scripts/
    get_ids.cdc
    get_certificate.cdc
flow.json
```

## Quickstart (Emulator)

1. Install Flow CLI (macOS)

```bash
brew install flow-cli
```

2. Start the local emulator (keep it running)

```bash
flow emulator start -v | cat
```

3. Deploy the contract (new terminal)

```bash
cd "$(dirname "$0")"
flow project deploy --network emulator | cat
```

> The default config deploys to `0xf8d6e0586b0a20c7` (emulator default account).

4. Create two test accounts, note addresses as `0xA...` and `0xB...`

```bash
flow accounts create --network emulator | cat
flow accounts create --network emulator | cat
```

5. Initialize each account’s collection (authorizers are A and B respectively)

```bash
flow transactions send ./cadence/transactions/setup_account.cdc \
  --network emulator \
  --signer bob | cat

flow transactions send ./cadence/transactions/setup_account.cdc \
  --network emulator \
  --signer alic | cat
```

6. Mint a pair (the deployer/contract account holds the `Minter`)

```bash
flow transactions send ./cadence/transactions/mint_pair.cdc \
  --network emulator \
  --signer deployer \
  --args-json '[\n  {"type": "Address", "value": "0x179b6b1cb6755e31"},\n  {"type": "Address", "value": "0xf3fcd2c1a78f5eee"},\n  {"type": "String", "value": "bob"},\n  {"type": "String", "value": "alic"},\n  {"type": "String", "value": "2025-08-23"},\n  {"type": "String", "value": "Till death do us part"},\n  {"type": "String", "value": "Brooklyn"},\n  {"type": "String", "value": "ipfs://Qm..."},\n  {"type": "Optional", "value": null}\n]' | cat
```

The log returns `(marriageId, tokenIdA, tokenIdB)`.

7. Query

```bash
# IDs owned by A
flow scripts execute ./cadence/scripts/get_ids.cdc \
  --network emulator 0xA... | cat

# Details of a certificate owned by A
flow scripts execute ./cadence/scripts/get_certificate.cdc \
  --network emulator 0xA... <tokenIdA> | cat
```

## Testnet/Mainnet

- Scripts/transactions import via the address alias: `import Marriage from 0xMarriage`.
- For emulator, `flow.json` already aliases `Marriage` to `0xf8d6e0586b0a20c7`.
- For testnet/mainnet, add an alias in `flow.json` under `aliases` for the target network and update your deployer account/keys. Then:

```bash
flow project deploy --network testnet
```

### Sample environment variables and deploy

```bash
# Testnet
export TESTNET_ADDRESS=YOUR_TESTNET_ADDRESS_WITHOUT_0x
export TESTNET_PRIVATE_KEY=YOUR_TESTNET_PRIVATE_KEY_HEX

# Mainnet (only if you plan to deploy on mainnet)
export MAINNET_ADDRESS=YOUR_MAINNET_ADDRESS_WITHOUT_0x
export MAINNET_PRIVATE_KEY=YOUR_MAINNET_PRIVATE_KEY_HEX

# Verify aliases and accounts
cat flow.json | sed -n '1,200p'

# Deploy to testnet
flow project deploy --network testnet | cat

# Deploy to mainnet (optional)
flow project deploy --network mainnet | cat
```

## CI: Deploy to Testnet on Tag

A GitHub Actions workflow is provided at `.github/workflows/deploy-testnet.yml`.

- Set repository secrets:
  - `TESTNET_ADDRESS`: Flow testnet account address (no leading 0x)
  - `TESTNET_PRIVATE_KEY`: Hex private key for that account
- Trigger by pushing a tag like `v1.0.0`:

```bash
git tag v1.0.0 && git push origin v1.0.0
```

The workflow will install Flow CLI and run `flow project deploy --network testnet` using the secrets.

## Notes

- `resource Certificate` is unique (non-copyable) with a unique `id` and a shared `marriageId`
- `Minter.mintPair` mints two certificates in one call with identical metadata
- To integrate with marketplace/wallet standards, you can extend `NonFungibleToken`/`MetadataViews` later
# flow-marriage
