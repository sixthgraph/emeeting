'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider refetchInterval={19 * 60}>{children}</SessionProvider>
}
