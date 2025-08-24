import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique ceremony room ID
export function generateCeremonyId(): string {
  const adjectives = ['magical', 'eternal', 'radiant', 'blessed', 'enchanted', 'golden', 'divine', 'celestial']
  const nouns = ['love', 'bond', 'union', 'harmony', 'journey', 'promise', 'dream', 'blessing']
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 9999) + 1000
  
  return `${adjective}-${noun}-${number}`
}

// Format date for display
export function formatCeremonyDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  }).format(date)
}

// Create magic link URL
export function createMagicLink(ceremonyId: string, partnerName: string, partner2Name?: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com'
  let url = `${baseUrl}/ceremony/${ceremonyId}?partner1=${encodeURIComponent(partnerName)}`
  if (partner2Name) {
    url += `&partner2=${encodeURIComponent(partner2Name)}`
  }
  return url
}

// Parse date string safely to avoid timezone issues
export function parseWeddingDate(dateString: string): Date {
  // If the date string is in YYYY-MM-DD format, add time to avoid UTC interpretation
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(dateString + 'T12:00:00')
  }
  return new Date(dateString)
}

// Truncate address for display
export function truncateAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3, ease: "easeOut" }
}

export const slideInFromRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.5, ease: "easeOut" }
}
