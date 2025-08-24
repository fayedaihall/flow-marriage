# 🚀 Complete End-to-End Flow Setup

Follow these steps to get the complete marriage dApp working with real blockchain interactions.

## 📋 Prerequisites

Make sure you have the Flow CLI installed and working from your original setup.

## 🏃‍♂️ Step-by-Step Setup

### 1. Start the Flow Emulator

Open a new terminal and navigate to your original contract directory:

```bash
cd /Users/fayehall/flow/marriage
flow emulator start
```

Keep this terminal running. You should see:
```
INFO[0000] ⚡ Starting emulator                          
INFO[0000] 📧 Server listening on port 3569
```

### 2. Deploy Your Marriage Contract

In another terminal, deploy the contract:

```bash
cd /Users/fayehall/flow/marriage  
flow project deploy --network=emulator
```

You should see successful deployment messages.

### 3. Start the Flow Dev Wallet

In a third terminal, start the dev wallet:

```bash
flow dev-wallet
```

This should open your browser to `http://localhost:8701` with the dev wallet interface.

### 4. Start Your Marriage dApp

In a fourth terminal, start the Next.js app:

```bash
cd /Users/fayehall/flow/marriage/marriage-dapp
npm run dev
```

Your app will be available at `http://localhost:3000`

## 🎯 Testing the Complete Flow

### Step 1: Access the dApp
Visit `http://localhost:3000`

### Step 2: Create a Ceremony
1. Click "Begin Your Journey"
2. Enter couple names (e.g., "Alice" and "Bob")
3. Choose "Share Link" option
4. Click "Create Ceremony Room"
5. Copy the magic link

### Step 3: Visit the Ceremony Room
1. Click "Enter Ceremony Room" or paste the magic link in a new tab
2. You'll see the wallet connection requirement

### Step 4: Connect Your Wallet
1. Click "Connect Wallet"
2. Your browser should redirect to the dev wallet at `localhost:8701`
3. Create a new account or use an existing one
4. Approve the connection
5. You'll be redirected back to the ceremony room

### Step 5: Complete the Ceremony
1. Wait for your "partner" to join (simulated after 2 seconds)
2. Click "Begin Your Ceremony"
3. Fill out the wedding details form:
   - Wedding Date
   - Location (e.g., "Blockchain Beach")
   - Your Vows (e.g., "Till death do us part, on-chain forever")
   - Officiant (optional)
4. Click "Ready for the Ceremony! 💍"

### Step 6: Mint Your Marriage NFTs! 🎉
1. You'll see the dramatic "Ready to say I Do?" screen
2. Click the pulsing **"I DO! 💍"** button
3. Watch as it changes to "Minting NFTs..." with a loading spinner
4. Your wallet will prompt you to approve the transaction
5. After approval, the NFTs will be minted on the blockchain!

### Step 7: View Your Certificate
1. You'll see the "Congratulations! 🎉" screen
2. Click "View Your Certificate"
3. See your beautiful marriage certificate with:
   - Real blockchain transaction hash
   - All your ceremony details
   - Professional certificate design
   - Sharing and download options

## 🔍 What's Happening Behind the Scenes

When you click "I DO!":

1. **Wallet Interaction**: Your connected Flow wallet is used
2. **Account Setup**: Your account is set up with a Marriage collection
3. **Real Minting**: The Marriage contract's `mintPair` function is called
4. **NFT Creation**: Two marriage certificate NFTs are created
5. **Blockchain Storage**: All ceremony data is stored permanently on Flow
6. **Transaction Receipt**: You get the real transaction hash
7. **Certificate Display**: Real blockchain data populates your certificate

## 🛠 Troubleshooting

### "Transaction failed"
- Make sure the Flow emulator is running on port 8888
- Check that your contract is deployed successfully
- Ensure your wallet has sufficient FLOW tokens

### "Wallet connection failed"  
- Verify the dev wallet is running on port 8701
- Try refreshing the dev wallet page
- Clear browser cache if needed

### "Contract not found"
- Ensure you deployed the contract with `flow project deploy --network=emulator`
- Check the contract address in `/lib/flow-service.ts` matches your deployment

## 🎊 Success!

Once everything works, you have a complete end-to-end marriage dApp that:

✅ **Beautiful UI/UX** - Professional ceremony experience  
✅ **Real Wallet Connection** - Flow wallet integration  
✅ **Blockchain Transactions** - Actual NFT minting  
✅ **Permanent Storage** - Data lives on Flow blockchain  
✅ **Professional Certificates** - Beautiful, shareable certificates  
✅ **Transaction Verification** - Real blockchain explorer links

Your marriage is now **officially recorded on the Flow blockchain!** 💍🔗
