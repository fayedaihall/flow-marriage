'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Download, Share2, Copy, Check, X, ExternalLink, Calendar, MapPin, Quote } from 'lucide-react'
import { fadeInUp, formatCeremonyDate, parseWeddingDate } from '@/lib/utils'

interface CertificateData {
  marriageId: string
  tokenId: string
  spouseAName: string
  spouseBName: string
  weddingDate: string
  location: string
  vows: string
  officiant?: string
  mintedAt: string
  blockchainTx: string
}

interface CertificateDisplayProps {
  certificate: CertificateData
  onClose: () => void
}

export function CertificateDisplay({ certificate, onClose }: CertificateDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  const certificateUrl = `${window.location.origin}/certificate/${certificate.tokenId}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToSocial = (platform: string) => {
    const text = `Just got married on the blockchain! 💍✨ Check out our digital marriage certificate:`
    const url = certificateUrl
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
    setShareMenuOpen(false)
  }

  const downloadCertificate = () => {
    // In a real app, this would generate a PDF or high-res image
    alert('PDF download feature coming soon! For now, you can screenshot this beautiful certificate.')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        {...fadeInUp} 
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
      >
        {/* Certificate Header */}
        <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <motion.div
              className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10" fill="currentColor" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">Marriage Certificate</h1>
            <p className="text-rose-100">Forever recorded on the Flow blockchain</p>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="p-8">
          {/* Ornamental Border */}
          <div className="border-4 border-rose-200 rounded-2xl p-8 bg-gradient-to-br from-rose-50 to-pink-50">
            {/* Certificate Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
                <h2 className="text-2xl font-bold text-gray-800">Certificate of Marriage</h2>
                <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-500 mx-auto"></div>
            </div>

            {/* Couple Names */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-2">This certifies that</p>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <h3 className="text-3xl font-bold text-gray-800">{certificate.spouseAName}</h3>
                <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
                <h3 className="text-3xl font-bold text-gray-800">{certificate.spouseBName}</h3>
              </div>
              <p className="text-lg text-gray-600">were united in marriage</p>
            </div>

            {/* Wedding Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/60 rounded-xl p-6 border border-rose-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="w-5 h-5 text-rose-500" />
                  <h4 className="font-semibold text-gray-800">Wedding Date</h4>
                </div>
                <p className="text-gray-600">{parseWeddingDate(certificate.weddingDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <div className="bg-white/60 rounded-xl p-6 border border-rose-200">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <h4 className="font-semibold text-gray-800">Location</h4>
                </div>
                <p className="text-gray-600">{certificate.location}</p>
              </div>
            </div>

            {/* Vows Section */}
            <div className="bg-white/60 rounded-xl p-6 border border-rose-200 mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <Quote className="w-5 h-5 text-rose-500" />
                <h4 className="font-semibold text-gray-800">Wedding Vows</h4>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"{certificate.vows}"</p>
            </div>

            {/* Officiant */}
            {certificate.officiant && (
              <div className="text-center mb-8">
                <p className="text-gray-600">Officiated by</p>
                <p className="text-lg font-semibold text-gray-800">{certificate.officiant}</p>
              </div>
            )}

            {/* Blockchain Details */}
            <div className="bg-white/80 rounded-xl p-6 border-2 border-rose-300 mb-8">
              <h4 className="font-semibold text-gray-800 mb-4 text-center">Blockchain Authentication</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Marriage ID</p>
                  <p className="font-mono text-gray-800">{certificate.marriageId}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Token ID</p>
                  <p className="font-mono text-gray-800">{certificate.tokenId}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Minted</p>
                  <p className="text-gray-800">{new Date(certificate.mintedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-rose-200">
                <p className="text-gray-500 font-medium mb-2">Transaction Hash</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm text-gray-600 break-all">{certificate.blockchainTx}</p>
                  <button
                    onClick={() => window.open(`https://flowscan.org/transaction/${certificate.blockchainTx}`, '_blank')}
                    className="p-1 hover:bg-rose-100 rounded transition-colors"
                    title="View on blockchain explorer"
                  >
                    <ExternalLink className="w-4 h-4 text-rose-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="text-center text-gray-500 text-sm">
              <p>This marriage certificate is permanently recorded on the Flow blockchain</p>
              <p>and represents a legally recognized union in the digital realm.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 bg-gray-50 rounded-b-3xl">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={downloadCertificate}
              className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>

              {shareMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border p-2 min-w-[160px]"
                >
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                  >
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => copyToClipboard(certificateUrl)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center space-x-2"
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
                </motion.div>
              )}
            </div>

            <button
              onClick={() => copyToClipboard(certificate.blockchainTx)}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition-colors"
            >
              <Copy className="w-5 h-5" />
              <span>Copy TX Hash</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
