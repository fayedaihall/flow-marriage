'use client'

import { motion } from 'framer-motion'
import { Wallet, LogOut, User, Heart, Sparkles } from 'lucide-react'
import { useFlow } from '@/hooks/useFlow'
import { fadeInUp, truncateAddress } from '@/lib/utils'

interface WalletConnectionProps {
  onConnected?: () => void
  className?: string
  showBalance?: boolean
  compact?: boolean
}

export function WalletConnection({ 
  onConnected, 
  className = "", 
  showBalance = false,
  compact = false 
}: WalletConnectionProps) {
  const { user, isLoggedIn, isLoading, logIn, logOut } = useFlow()

  const handleConnect = async () => {
    try {
      await logIn()
      if (onConnected) onConnected()
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-500"></div>
        <span className="text-gray-600">Connecting...</span>
      </div>
    )
  }

  if (isLoggedIn && user?.addr) {
    // Connected state
    return (
      <motion.div 
        {...fadeInUp}
        className={`flex items-center space-x-3 ${className}`}
      >
        {!compact && (
          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-full border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-sm text-emerald-700 font-medium">Connected</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm">
          <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {truncateAddress(user.addr)}
            </span>
            {showBalance && (
              <span className="text-xs text-gray-500">Flow Wallet</span>
            )}
          </div>
        </div>

        <button
          onClick={logOut}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-lg transition-all"
          title="Disconnect wallet"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </motion.div>
    )
  }

  // Disconnected state
  return (
    <motion.div 
      {...fadeInUp}
      className={`${className}`}
    >
      <button
        onClick={handleConnect}
        className="group relative bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        disabled={isLoading}
      >
        <motion.div
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
        >
          <Wallet className="w-5 h-5" />
        </motion.div>
        <span>
          {compact ? 'Connect' : 'Connect Wallet'}
        </span>
        
        {!compact && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-xl"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </button>
    </motion.div>
  )
}

// Compact version for headers/nav
export function WalletButton({ className = "" }: { className?: string }) {
  return (
    <WalletConnection 
      className={className}
      compact={true}
    />
  )
}

// Full featured version with status
export function WalletStatus({ className = "" }: { className?: string }) {
  const { user, isLoggedIn, isLoading } = useFlow()

  if (isLoading) {
    return (
      <div className={`text-center ${className}`}>
        <div className="inline-flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500"></div>
          <span>Loading wallet...</span>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className={`text-center ${className}`}>
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-4">
            To get married on the blockchain, you'll need to connect your Flow wallet.
          </p>
        </div>
        <WalletConnection />
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-6">
        <motion.div 
          className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Wallet Connected!</h3>
        <p className="text-gray-600 mb-4">
          Address: <span className="font-mono">{truncateAddress(user?.addr || '')}</span>
        </p>
      </div>
      
      <div className="flex items-center justify-center">
        <WalletConnection showBalance={true} />
      </div>
    </div>
  )
}
