import { useState, useEffect } from 'react'
import { FlowService } from '@/lib/flow-service'

interface FlowUser {
  addr?: string
  loggedIn?: boolean
  cid?: string
  [key: string]: any
}

export function useFlow() {
  const [user, setUser] = useState<FlowUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Subscribe to authentication changes
    const unsubscribe = FlowService.subscribeToUser((currentUser: FlowUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    // Get initial user state
    setUser(FlowService.getCurrentUser())
    setIsLoading(false)

    return unsubscribe
  }, [])

  const logIn = async () => {
    setIsLoading(true)
    try {
      await FlowService.authenticate()
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logOut = async () => {
    setIsLoading(true)
    try {
      await FlowService.unauthenticate()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupAccount = async () => {
    if (!user?.addr) throw new Error('User not logged in')
    
    setIsLoading(true)
    try {
      return await FlowService.setupAccount(user.addr)
    } catch (error) {
      console.error('Setup account error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getCertificateIds = async (address?: string) => {
    const targetAddress = address || user?.addr
    if (!targetAddress) throw new Error('No address provided')
    
    return await FlowService.getUserCertificateIds(targetAddress)
  }

  const getCertificate = async (tokenId: number, address?: string) => {
    const targetAddress = address || user?.addr
    if (!targetAddress) throw new Error('No address provided')
    
    return await FlowService.getCertificate(targetAddress, tokenId)
  }

  const mintMarriage = async (
    recipientAAddress: string,
    recipientBAddress: string,
    marriageData: {
      spouseAName: string
      spouseBName: string
      weddingDate: string
      vows: string
      location: string
      uri: string
      officiant?: string
    }
  ) => {
    if (!user?.loggedIn) throw new Error('User not logged in')
    
    setIsLoading(true)
    try {
      return await FlowService.mintMarriagePair(
        recipientAAddress,
        recipientBAddress,
        marriageData
      )
    } catch (error) {
      console.error('Mint marriage error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoggedIn: user?.loggedIn ?? false,
    isLoading,
    logIn,
    logOut,
    setupAccount,
    getCertificateIds,
    getCertificate,
    mintMarriage
  }
}
