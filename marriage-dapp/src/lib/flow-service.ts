import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

// Update this with your actual deployed contract address
const MARRIAGE_CONTRACT_ADDRESS = "0x86a4bf5530e0e76e" // Your testnet address

// Cadence scripts for reading data
const GET_COLLECTION_IDS = `
import Marriage from ${MARRIAGE_CONTRACT_ADDRESS}

access(all) fun main(address: Address): [UInt64] {
  let account = getAccount(address)
  let collectionRef = account.capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
    ?? panic("Could not borrow collection reference")
  
  return collectionRef.getIDs()
}
`

const GET_CERTIFICATE = `
import Marriage from ${MARRIAGE_CONTRACT_ADDRESS}

access(all) fun main(address: Address, tokenId: UInt64): {String: String}? {
  let account = getAccount(address)
  let collectionRef = account.capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
    ?? panic("Could not borrow collection reference")
  
  if let certificateRef = collectionRef.borrowCertificate(id: tokenId) {
    let metadata: {String: String} = {
      "id": certificateRef.id.toString(),
      "marriageId": certificateRef.marriageId.toString(),
      "spouseAName": certificateRef.metadata.spouseAName,
      "spouseBName": certificateRef.metadata.spouseBName,
      "weddingDate": certificateRef.metadata.weddingDate,
      "vows": certificateRef.metadata.vows,
      "location": certificateRef.metadata.location,
      "uri": certificateRef.metadata.uri
    }
    
    if let officiant = certificateRef.metadata.officiant {
      metadata["officiant"] = officiant
    }
    
    return metadata
  }
  
  return nil
}
`

// Cadence transactions
const SETUP_ACCOUNT = `
import Marriage from ${MARRIAGE_CONTRACT_ADDRESS}

transaction {
  prepare(signer: auth(Storage, Capabilities) &Account) {
    if signer.storage.borrow<&Marriage.Collection>(from: Marriage.CollectionStoragePath) == nil {
      signer.storage.save(<- Marriage.createEmptyCollection(), to: Marriage.CollectionStoragePath)
      
      signer.capabilities.publish(
        signer.capabilities.storage.issue<&Marriage.Collection>(Marriage.CollectionStoragePath),
        at: Marriage.CollectionPublicPath
      )
    }
  }
}
`

const MINT_MARRIAGE_PAIR = `
import Marriage from ${MARRIAGE_CONTRACT_ADDRESS}

transaction(
  recipientAAddress: Address,
  recipientBAddress: Address,
  spouseAName: String,
  spouseBName: String,
  weddingDate: String,
  vows: String,
  location: String,
  uri: String,
  officiant: String?
) {
  let minterRef: &Marriage.Minter
  
  prepare(signer: auth(Storage) &Account) {
    self.minterRef = signer.storage.borrow<&Marriage.Minter>(from: Marriage.MinterStoragePath)
      ?? panic("Could not borrow minter reference")
  }
  
  execute {
    let recipientA = getAccount(recipientAAddress)
      .capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
      ?? panic("Could not borrow recipient A collection reference")
      
    let recipientB = getAccount(recipientBAddress)
      .capabilities.borrow<&Marriage.Collection>(Marriage.CollectionPublicPath)
      ?? panic("Could not borrow recipient B collection reference")
      
    let metadata = Marriage.Metadata(
      spouseAName: spouseAName,
      spouseBName: spouseBName,
      weddingDate: weddingDate,
      vows: vows,
      location: location,
      uri: uri,
      officiant: officiant
    )
    
    let result = self.minterRef.mintPair(
      recipientA: recipientA,
      recipientB: recipientB,
      metadata: metadata,
      toA: recipientAAddress,
      toB: recipientBAddress
    )
    
    log("Marriage minted with ID: ".concat(result[0].toString()))
  }
}
`

export class FlowService {
  // Initialize FCL configuration
  static init() {
    fcl.config({
      "accessNode.api": "https://rest-testnet.onflow.org", // Testnet REST API
      "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Testnet Wallet Discovery
      "flow.network": "testnet"
    })
  }

  // Get current user
  static getCurrentUser() {
    return fcl.currentUser.snapshot()
  }

  // Subscribe to user changes
  static subscribeToUser(callback: (user: any) => void) {
    return fcl.currentUser.subscribe(callback)
  }

  // Authenticate user
  static async authenticate() {
    return await fcl.authenticate()
  }

  // Unauthenticate user  
  static async unauthenticate() {
    return await fcl.unauthenticate()
  }

  // Setup user account for Marriage collection
  static async setupAccount(userAddress: string) {
    try {
      const txId = await fcl.mutate({
        cadence: SETUP_ACCOUNT,
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 1000
      })

      console.log("Setup account transaction sent:", txId)
      return await fcl.tx(txId).onceSealed()
    } catch (error) {
      console.error("Error setting up account:", error)
      throw error
    }
  }

  // Get user's certificate IDs
  static async getUserCertificateIds(address: string): Promise<number[]> {
    try {
      const result = await fcl.query({
        cadence: GET_COLLECTION_IDS,
        args: (arg: any, t: any) => [arg(address, t.Address)]
      })
      return result || []
    } catch (error) {
      console.error("Error getting certificate IDs:", error)
      return []
    }
  }

  // Get certificate details
  static async getCertificate(address: string, tokenId: number) {
    try {
      const result = await fcl.query({
        cadence: GET_CERTIFICATE,
        args: (arg: any, t: any) => [
          arg(address, t.Address),
          arg(tokenId.toString(), t.UInt64)
        ]
      })
      return result
    } catch (error) {
      console.error("Error getting certificate:", error)
      return null
    }
  }

  // Mint marriage pair (admin function)
  static async mintMarriagePair(
    recipientAAddress: string,
    recipientBAddress: string,
    marriageData: {
      spouseAName: string
      spouseBName: string
      weddingDate: string
      vows: string
      location: string
      uri: string
      officiant?: string
    }
  ) {
    try {
      const txId = await fcl.mutate({
        cadence: MINT_MARRIAGE_PAIR,
        args: (arg: any, t: any) => [
          arg(recipientAAddress, t.Address),
          arg(recipientBAddress, t.Address),
          arg(marriageData.spouseAName, t.String),
          arg(marriageData.spouseBName, t.String),
          arg(marriageData.weddingDate, t.String),
          arg(marriageData.vows, t.String),
          arg(marriageData.location, t.String),
          arg(marriageData.uri, t.String),
          arg(marriageData.officiant || null, t.Optional(t.String))
        ],
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 1000
      })

      console.log("Mint marriage transaction sent:", txId)
      const sealedTx = await fcl.tx(txId).onceSealed()
      
      return {
        transactionId: txId,
        status: sealedTx.status,
        events: sealedTx.events
      }
    } catch (error) {
      console.error("Error minting marriage:", error)
      throw error
    }
  }

  // Wait for transaction to be sealed
  static async waitForTransaction(txId: string) {
    return await fcl.tx(txId).onceSealed()
  }

  // Get transaction status
  static async getTransactionStatus(txId: string) {
    return await fcl.tx(txId).snapshot()
  }
}

// Initialize FCL on import
FlowService.init()
