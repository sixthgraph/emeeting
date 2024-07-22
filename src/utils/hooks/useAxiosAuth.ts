'use client'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import { axiosAuth } from '../axios'
import { useRefreshToken } from './useRefreshToken'

const useAxiosAuth = () => {
  const { data: session } = useSession()
  const refreshToken = useRefreshToken()

  console.log('session00000')
  console.log(session)

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${session?.user.token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    const responseIntercept = axiosAuth.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error.config

        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          await refreshToken()
          prevRequest.headers['Authorization'] = `Brearer ${session?.user.token}`

          return axiosAuth(prevRequest)
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept)
      axiosAuth.interceptors.response.eject(responseIntercept)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return axiosAuth
}

export default useAxiosAuth
