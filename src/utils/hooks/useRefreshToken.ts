'use client'

import { useSession } from 'next-auth/react'

import axios from '../axios'

export const useRefreshToken = () => {
  const { data: session } = useSession()

  const refreshToken = async () => {
    const res = await axios.post('/auth/refresh', {
      refresh: session?.user.refreshToken
    })

    if (session) session.user.token = res.data.token
  }

  return refreshToken
}
