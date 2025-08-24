import * as fcl from "@onflow/fcl"

// Flow configuration for emulator
fcl.config({
  "accessNode.api": "http://127.0.0.1:8888", // Emulator REST API
  "discovery.wallet": "http://127.0.0.1:8701/fcl/authn", // Dev Wallet
  "0xMarriage": "0xf8d6e0586b0a20c7", // Your emulator contract address
  "flow.network": "emulator"
})

// Contract addresses
export const CONTRACTS = {
  Marriage: "0xYOUR_CONTRACT_ADDRESS_HERE" // Replace with your deployed contract address
}

// For emulator development, use these settings:
export const setupEmulator = () => {
  fcl.config({
    "accessNode.api": "http://127.0.0.1:8888",
    "discovery.wallet": "http://127.0.0.1:8701/fcl/authn",
    "0xMarriage": "0xf8d6e0586b0a20c7", // Your emulator contract address
    "flow.network": "emulator"
  })
}
