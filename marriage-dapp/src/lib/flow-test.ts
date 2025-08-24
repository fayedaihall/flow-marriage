import * as fcl from "@onflow/fcl"

console.log("Flow test service loading...")

// Minimal FCL configuration for testing
export function initFlowTest() {
  console.log("Initializing Flow test configuration...")
  
  fcl.config({
    "accessNode.api": "http://127.0.0.1:8888",
    "discovery.wallet": "http://127.0.0.1:8701/fcl/authn",
    "flow.network": "emulator"
  })
  
  console.log("FCL configured for testing")
}

export async function testAuthentication() {
  console.log("Testing authentication...")
  try {
    const user = await fcl.authenticate()
    console.log("Authentication result:", user)
    return user
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

export function getCurrentUser() {
  return fcl.currentUser.snapshot()
}
