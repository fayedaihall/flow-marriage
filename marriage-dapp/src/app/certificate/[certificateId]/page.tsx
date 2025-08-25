'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Download, Share2, Copy, Check, ExternalLink, Calendar, MapPin, Quote, Crown, Sparkles } from 'lucide-react'
import { FlowService } from '@/lib/flow-service'
import { parseWeddingDate } from '@/lib/utils'
import { generateCertificatePDFFromHTML } from '@/lib/pdf-generator'

interface CertificateData {
  id: string
  marriageId: string
  spouseAName: string
  spouseBName: string
  weddingDate: string
  vows: string
  location: string
  uri: string
  officiant?: string
}

export default function CertificatePage() {
  const params = useParams()
  const certificateId = params?.certificateId as string
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!certificateId) return

      try {
        setLoading(true)
        setError(null)

        // First, try to get the certificate from the contract owner's account
        const contractAddress = "0x86a4bf5530e0e76e" // Testnet contract address
        
        const certificateData = await FlowService.getCertificate(contractAddress, parseInt(certificateId))
        
        if (certificateData) {
          setCertificate(certificateData)
        } else {
          setError('Certificate not found')
        }
      } catch (err) {
        console.error('Failed to fetch certificate:', err)
        setError('Failed to load certificate')
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [certificateId])

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
    const url = window.location.href
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ExternalLink className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || 'The certificate you\'re looking for could not be found.'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Certificate Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-8 text-white rounded-t-3xl">
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
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl p-8 border-x border-white/20">
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
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Marriage ID</p>
                  <p className="font-mono text-gray-800">{certificate.marriageId}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Token ID</p>
                  <p className="font-mono text-gray-800">{certificate.id}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-rose-200">
                <p className="text-gray-500 font-medium mb-2">Contract Address</p>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm text-gray-600 break-all">0x86a4bf5530e0e76e</p>
                  <button
                    onClick={() => window.open(`https://testnet.flowscan.io/account/0x86a4bf5530e0e76e`, '_blank')}
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
        <div className="bg-gray-50 p-8 rounded-b-3xl shadow-2xl border-x border-b border-white/20">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={async () => {
                try {
                  await generateCertificatePDFFromHTML(certificate)
                } catch (error) {
                  console.error('Failed to generate PDF:', error)
                  alert('Failed to generate PDF. Please try again.')
                }
              }}
              className="flex items-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share on Twitter</span>
            </button>

            <button
              onClick={() => copyToClipboard(window.location.href)}
              className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Create Your Own Marriage Certificate
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
