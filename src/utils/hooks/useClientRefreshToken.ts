'use client'

import { useSession } from 'next-auth/react'

//import axios from '../axios'

export const useClientRefreshToken = () => {
  const { data: session } = useSession()

  console.log('session333=== ')

  console.log(session?.user.token)

  return 'aaa'

  // const refreshToken = async () => {
  //   if (updateToken !== session?.user.token) {
  //     console.log('todo update token to ', updateToken)
  //   }
  // }

  // // const refreshToken = async () => {
  // //   const res = await axios.post('/auth/refresh', {
  // //     refresh: session?.user.refreshToken
  // //   })

  // //   if (session) session.user.token = res.data.token
  // // }

  // return refreshToken
}
