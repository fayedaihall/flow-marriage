'use client'

import { useState } from 'react'
import { WelcomeScreen } from '@/components/welcome-screen'
import { CoupleSetup } from '@/components/couple-setup'

type AppState = 'welcome' | 'setup' | 'ceremony'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('welcome')
  const [ceremonyData, setCeremonyData] = useState<{
    ceremonyId: string
    names: { partner1: string, partner2: string }
  } | null>(null)

  const handleGetStarted = () => {
    setAppState('setup')
  }

  const handleBack = () => {
    setAppState('welcome')
  }

  const handleCeremonyCreated = (ceremonyId: string, names: { partner1: string, partner2: string }) => {
    setCeremonyData({ ceremonyId, names })
    // Note: Navigation to ceremony room is handled in the CoupleSetup component
  }

  if (appState === 'welcome') {
    return <WelcomeScreen onGetStarted={handleGetStarted} />
  }

  if (appState === 'setup') {
    return (
      <CoupleSetup 
        onBack={handleBack} 
        onCeremonyCreated={handleCeremonyCreated}
      />
    )
  }

  return null
}
