'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Mail, MessageCircle, X, ArrowRight, Copy, Check } from "lucide-react"
import { fadeInUp, generateCeremonyId, createMagicLink } from "@/lib/utils"

interface CoupleSetupProps {
  onBack: () => void
  onCeremonyCreated: (ceremonyId: string, names: { partner1: string, partner2: string }) => void
}

export function CoupleSetup({ onBack, onCeremonyCreated }: CoupleSetupProps) {
  const [step, setStep] = useState(1)
  const [partner1Name, setPartner1Name] = useState('')
  const [partner2Name, setPartner2Name] = useState('')
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'link'>('email')
  const [contactInfo, setContactInfo] = useState('')
  const [ceremonyId, setCeremonyId] = useState('')
  const [magicLink, setMagicLink] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCreateCeremony = () => {
    const id = generateCeremonyId()
    const link = createMagicLink(id, partner1Name, partner2Name)
    
    setCeremonyId(id)
    setMagicLink(link)
    setStep(3)
    
    onCeremonyCreated(id, { partner1: partner1Name, partner2: partner2Name })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(magicLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div {...fadeInUp} className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <button
              onClick={onBack}
              className="mb-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about yourselves</h2>
              <p className="text-gray-600">What should we call you during the ceremony?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name or nickname
                </label>
                <input
                  type="text"
                  value={partner1Name}
                  onChange={(e) => setPartner1Name(e.target.value)}
                  placeholder="e.g., Sarah, S, Sunshine"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your partner's name or nickname
                </label>
                <input
                  type="text"
                  value={partner2Name}
                  onChange={(e) => setPartner2Name(e.target.value)}
                  placeholder="e.g., Alex, A, Amazing"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              <motion.button
                onClick={() => setStep(2)}
                disabled={!partner1Name.trim() || !partner2Name.trim()}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div {...fadeInUp} className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <button
              onClick={() => setStep(1)}
              className="mb-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowRight className="w-6 h-6 rotate-180" />
            </button>

            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Invite {partner2Name}</h2>
              <p className="text-gray-600">How would you like to invite them to your ceremony?</p>
            </div>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => setContactMethod('email')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  contactMethod === 'email'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-rose-500" />
                  <div className="text-left">
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-500">Send them a beautiful invitation</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setContactMethod('link')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  contactMethod === 'link'
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Copy className="w-6 h-6 text-rose-500" />
                  <div className="text-left">
                    <div className="font-medium">Share Link</div>
                    <div className="text-sm text-gray-500">Get a magic link to share however you'd like</div>
                  </div>
                </div>
              </button>
            </div>

            {contactMethod === 'email' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {partner2Name}'s email
                </label>
                <input
                  type="email"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="partner@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            )}

            <motion.button
              onClick={handleCreateCeremony}
              disabled={contactMethod === 'email' && !contactInfo.trim()}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Ceremony Room
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Step 3 - Magic Link Created
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div {...fadeInUp} className="max-w-lg w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <motion.div
              className="mx-auto w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your ceremony room is ready!</h2>
            <p className="text-gray-600">
              Room ID: <span className="font-mono font-medium text-rose-600">{ceremonyId}</span>
            </p>
          </div>

          <div className="bg-rose-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Magic Link for {partner2Name}</h3>
            <div className="bg-white rounded-lg p-4 mb-4 border border-rose-200">
              <p className="text-sm text-gray-600 break-all font-mono">{magicLink}</p>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Send this link to {partner2Name} and you'll both be brought together in your private ceremony room.
            </p>
            
            <motion.button
              onClick={() => window.location.href = magicLink}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Ceremony Room
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
