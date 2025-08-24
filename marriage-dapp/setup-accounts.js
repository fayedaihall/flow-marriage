#!/usr/bin/env node

// This script sets up test accounts for the marriage dApp
// Run with: node setup-accounts.js

import { FlowService } from './src/lib/flow-service.js'

async function setupTestAccounts() {
  console.log('🚀 Setting up test accounts for Marriage dApp...\n')
  
  try {
    // Initialize Flow service
    FlowService.init()
    
    console.log('✅ Flow service initialized')
    console.log('📍 Emulator should be running on http://127.0.0.1:8888')
    console.log('🔧 Dev wallet should be running on http://127.0.0.1:8701')
    console.log('📱 Marriage dApp should be running on http://localhost:3000\n')
    
    console.log('🎯 Next steps:')
    console.log('1. Visit http://localhost:3000')
    console.log('2. Create a ceremony and get the magic link')
    console.log('3. Visit the ceremony room')
    console.log('4. Connect your wallet via the dev wallet')
    console.log('5. Complete the ceremony and mint your NFTs!')
    console.log('6. View your beautiful marriage certificate\n')
    
    console.log('💡 The "I DO!" button will now mint real NFTs on the Flow blockchain!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    console.log('\n🔧 Make sure:')
    console.log('1. Flow emulator is running: `flow emulator start`')
    console.log('2. Contract is deployed: `flow project deploy --network=emulator`')
    console.log('3. Dev wallet is running: `flow dev-wallet`')
  }
}

// Run the setup
setupTestAccounts()
