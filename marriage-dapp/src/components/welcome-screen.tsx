'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Heart, Sparkles, Users } from "lucide-react"
import { fadeInUp, scaleIn } from "@/lib/utils"
import { WalletButton } from "./wallet-connection"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Floating hearts animation */}
        {dimensions.width > 0 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-rose-200"
                initial={{ 
                  x: Math.random() * dimensions.width,
                  y: dimensions.height + 50,
                  opacity: 0
                }}
                animate={{
                  y: -50,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Heart className="w-4 h-4" fill="currentColor" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Main content */}
        <motion.div {...fadeInUp} className="relative z-10">
          {/* Logo/Icon */}
          <motion.div 
            {...scaleIn}
            className="mb-8"
          >
            <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
              <Users className="w-12 h-12 text-white" />
              <motion.div
                className="absolute -top-2 -right-2 text-yellow-400"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-6 h-6" fill="currentColor" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Celebrate Your Love
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            On Chain, Forever
          </motion.p>

          <motion.p 
            className="text-lg text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Create a beautiful, permanent record of your union on the Flow blockchain. 
            Your love story, secured for eternity.
          </motion.p>

          {/* Features */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <Heart className="w-8 h-8 text-rose-500 mx-auto mb-3" fill="currentColor" />
              <h3 className="font-semibold text-gray-800 mb-2">Together, Always</h3>
              <p className="text-gray-600 text-sm">Experience your ceremony together in real-time</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" fill="currentColor" />
              <h3 className="font-semibold text-gray-800 mb-2">Forever Secure</h3>
              <p className="text-gray-600 text-sm">Your certificate lives permanently on the blockchain</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <Users className="w-8 h-8 text-pink-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Share Your Joy</h3>
              <p className="text-gray-600 text-sm">Celebrate with friends and family</p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={onGetStarted}
            className="group relative bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xl font-semibold py-4 px-12 rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="relative z-10">Begin Your Journey</span>
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.p 
            className="text-gray-400 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            No wallet required to start • Secure • Private
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
