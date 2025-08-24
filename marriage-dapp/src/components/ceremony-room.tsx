'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Users, Sparkles, Camera, Clock, MapPin, MessageCircle, Crown, Wallet, AlertCircle } from 'lucide-react'
import { fadeInUp, scaleIn } from '@/lib/utils'
import { CertificateDisplay } from './certificate-display'
import { WalletStatus } from './wallet-connection'
import { useFlow } from '@/hooks/useFlow'

interface CeremonyRoomProps {
  ceremonyId: string
  partner1Name?: string
  partner2Name?: string
}

interface Partner {
  name: string
  isReady: boolean
  avatar?: string
  isOnline: boolean
}

interface CeremonyProgress {
  step: 'waiting' | 'details' | 'vows' | 'ceremony' | 'complete'
  bothReady: boolean
}

export function CeremonyRoom({ ceremonyId, partner1Name, partner2Name }: CeremonyRoomProps) {
  const { user, isLoggedIn, isLoading, setupAccount, mintMarriage } = useFlow()
  const [currentUser, setCurrentUser] = useState<Partner>({ name: '', isReady: false, isOnline: true })
  const [partner, setPartner] = useState<Partner | null>(null)
  const [progress, setProgress] = useState<CeremonyProgress>({ step: 'waiting', bothReady: false })
  const [showCertificate, setShowCertificate] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<'setup' | 'minting' | 'complete'>('setup')
  const [certificateData, setCertificateData] = useState<any>(null)
  const [ceremonyDetails, setCeremonyDetails] = useState({
    date: '',
    vows: '',
    location: '',
    officiant: ''
  })

  // Simulated real-time connection (in real app, this would be WebSocket)
  useEffect(() => {
    // Simulate partner joining after a delay
    const timer = setTimeout(() => {
      setPartner({
        name: partner2Name || 'Your Partner',
        isReady: false,
        isOnline: true
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [partner2Name])

  const handleUserReady = () => {
    setCurrentUser(prev => ({ ...prev, isReady: !prev.isReady }))
  }

  const handleInputChange = (field: string, value: string) => {
    setCeremonyDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleMarriageMinting = async () => {
    if (!user?.addr) {
      alert('Please connect your wallet first!')
      return
    }

    setIsProcessing(true)
    setProcessingStep('setup')
    try {
      // First, ensure the user's account is set up for Marriage NFTs
      console.log('Setting up account for Marriage NFTs...')
      await setupAccount()
      console.log('Account setup complete!')
      
      setProcessingStep('minting')
      
      // For demo purposes, we'll mint to the same user twice
      // In a real app, you'd have both partner addresses
      const partnerAddress = user.addr // This would be the actual partner's address
      
      console.log('Minting marriage certificates...')
      console.log('User address:', user.addr)
      console.log('Partner address:', partnerAddress)
      console.log('Ceremony details:', ceremonyDetails)

      const result = await mintMarriage(
        user.addr,        // Recipient A (current user)
        partnerAddress,   // Recipient B (partner - for demo, same as user)
        {
          spouseAName: partner1Name || 'Partner A',
          spouseBName: partner2Name || 'Partner B',
          weddingDate: ceremonyDetails.date || new Date().toISOString().split('T')[0],
          vows: ceremonyDetails.vows || 'Till death do us part, and beyond into the blockchain',
          location: ceremonyDetails.location || 'Digital Ceremony Room',
          uri: `https://flowmarriage.app/certificate/${ceremonyId}`,
          officiant: ceremonyDetails.officiant || undefined
        }
      )

      console.log('Marriage minted successfully:', result)
      
      setProcessingStep('complete')
      
      // Create certificate data with real information
      const realCertificateData = {
        marriageId: result?.events?.[0]?.data?.marriageId || '1',
        tokenId: result?.events?.[0]?.data?.tokenId || '1',
        spouseAName: partner1Name || 'Partner A',
        spouseBName: partner2Name || 'Partner B',
        weddingDate: ceremonyDetails.date || new Date().toISOString().split('T')[0],
        location: ceremonyDetails.location || 'Digital Ceremony Room',
        vows: ceremonyDetails.vows || 'Till death do us part, and beyond into the blockchain',
        officiant: ceremonyDetails.officiant || 'Rev. Flow',
        mintedAt: new Date().toISOString(),
        blockchainTx: result?.transactionId || 'No transaction ID'
      }
      
      setCertificateData(realCertificateData)
      console.log('Certificate data created:', realCertificateData)
      
      // Move to completion step
      setProgress({ step: 'complete', bothReady: true })
      
    } catch (error) {
      console.error('Marriage minting failed:', error)
      alert(`Marriage minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Check if wallet is connected before showing ceremony
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div {...fadeInUp} className="max-w-lg w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Ceremony Room</h2>
              <p className="text-rose-600 font-mono font-medium mb-4">{ceremonyId}</p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-amber-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Wallet Required</span>
                </div>
                <p className="text-amber-600 text-sm mt-2">
                  To participate in the ceremony and mint your marriage certificate, you'll need to connect your Flow wallet.
                </p>
              </div>
            </div>
            
            <WalletStatus />
          </div>
        </motion.div>
      </div>
    )
  }

  if (progress.step === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div {...fadeInUp} className="max-w-lg w-full text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Room Header */}
            <div className="mb-8">
              <motion.div
                className="mx-auto w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Ceremony Room</h1>
              <p className="text-rose-600 font-mono font-medium">{ceremonyId}</p>
            </div>

            {/* Participants */}
            <div className="space-y-4 mb-8">
              {/* Current User */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">You</p>
                    <p className="text-sm text-emerald-600">Online</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              </div>

              {/* Partner */}
              <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                partner?.isOnline 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    partner?.isOnline ? 'bg-emerald-400' : 'bg-gray-300'
                  }`}>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {partner?.name || 'Waiting for partner...'}
                    </p>
                    <p className={`text-sm ${
                      partner?.isOnline ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      {partner?.isOnline ? 'Online' : 'Waiting to join...'}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  partner?.isOnline ? 'bg-emerald-400' : 'bg-gray-300'
                }`}></div>
              </div>
            </div>

            {partner ? (
              <motion.button
                onClick={() => setProgress({ step: 'details', bothReady: false })}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Begin Your Ceremony
              </motion.button>
            ) : (
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center space-x-2 text-gray-600"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5" />
                  <span>Waiting for your partner to join...</span>
                  <Heart className="w-5 h-5" />
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  if (progress.step === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div {...fadeInUp} className="max-w-2xl w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Wedding Details</h2>
              <p className="text-gray-600">Fill this out together - both of you can edit in real-time</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={ceremonyDetails.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={ceremonyDetails.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Malibu Beach, CA"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Your Vows
              </label>
              <textarea
                value={ceremonyDetails.vows}
                onChange={(e) => handleInputChange('vows', e.target.value)}
                placeholder="Write your vows from the heart..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                Officiant (Optional)
              </label>
              <input
                type="text"
                value={ceremonyDetails.officiant}
                onChange={(e) => handleInputChange('officiant', e.target.value)}
                placeholder="e.g., Rev. Smith, Your friend's name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>

            <motion.button
              onClick={() => setProgress({ step: 'ceremony', bothReady: true })}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ready for the Ceremony! 💍
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (progress.step === 'ceremony') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div {...scaleIn} className="max-w-lg w-full text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <motion.div
              className="mx-auto w-24 h-24 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-8"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 text-white" fill="currentColor" />
            </motion.div>

            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to say "I Do"?
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              When both of you click the button below, your marriage will be recorded on the blockchain forever.
            </p>

            {/* Countdown could go here */}
            <motion.button
              onClick={handleMarriageMinting}
              disabled={isProcessing}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 disabled:cursor-not-allowed"
              whileHover={{ scale: isProcessing ? 1 : 1.05 }}
              whileTap={{ scale: isProcessing ? 1 : 0.95 }}
              animate={{
                boxShadow: isProcessing ? [
                  "0 5px 15px rgba(156, 163, 175, 0.3)"
                ] : [
                  "0 10px 30px rgba(236, 72, 153, 0.3)",
                  "0 15px 40px rgba(236, 72, 153, 0.4)",
                  "0 10px 30px rgba(236, 72, 153, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: isProcessing ? 0 : Infinity }}
            >
              {isProcessing ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>
                    {processingStep === 'setup' && 'Setting up account...'}
                    {processingStep === 'minting' && 'Minting NFTs...'}
                    {processingStep === 'complete' && 'Complete!'}
                  </span>
                </div>
              ) : (
                'I DO! 💍'
              )}
            </motion.button>

            <p className="text-gray-400 text-sm mt-6">
              Your partner needs to click too - then the magic happens!
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Complete state would show certificate and sharing options
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div {...fadeInUp} className="max-w-lg w-full text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <motion.div
            className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Congratulations! 🎉</h2>
          <p className="text-lg text-gray-600 mb-8">
            Your marriage has been recorded on the blockchain. You're officially married!
          </p>
          
          <div className="bg-rose-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Your Certificate</h3>
            <p className="text-gray-600">NFT certificates have been minted to both of your wallets</p>
          </div>
          
          <button 
            onClick={() => setShowCertificate(true)}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
          >
            View Your Certificate
          </button>
        </div>

        {/* Certificate Modal */}
        {showCertificate && certificateData && (
          <CertificateDisplay 
            certificate={certificateData} 
            onClose={() => setShowCertificate(false)} 
          />
        )}
      </motion.div>
    </div>
  )
}
