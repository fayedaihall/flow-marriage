'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CeremonyRoom } from '@/components/ceremony-room'

interface CeremonyPageProps {
  params: Promise<{
    ceremonyId: string
  }>
}

export default function CeremonyPage({ params }: CeremonyPageProps) {
  const [mounted, setMounted] = useState(false)
  const [ceremonyId, setCeremonyId] = useState<string>('')
  const searchParams = useSearchParams()
  const partner1Name = searchParams?.get('partner1')
  const partner2Name = searchParams?.get('partner2')

  useEffect(() => {
    params.then(p => setCeremonyId(p.ceremonyId))
    setMounted(true)
  }, [params])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ceremony room...</p>
        </div>
      </div>
    )
  }

  return (
    <CeremonyRoom 
      ceremonyId={ceremonyId} 
      partner1Name={partner1Name || undefined}
      partner2Name={partner2Name || undefined}
    />
  )
}
