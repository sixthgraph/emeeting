'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

export default function UpdateToken(updateToken: any) {
  const { data: session, update } = useSession()
  const [tokenData, setTokenData] = useState(session?.user.token)

  async function updateSession() {
    await update({
      ...session,
      user: {
        ...session?.user,
        token: updateToken
      }
    })
  }

  useEffect(() => {
    updateSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData])

  if (tokenData !== updateToken) {
    setTokenData(updateToken)
  }

  return 'success'
}
