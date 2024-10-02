'use server'

import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

export const getDocument = async (wid: any) => {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  const reqBody = {
    wid: wid,
    itemno: '',
    token: token
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/list`, reqBody)

    let resData = response.data.data

    console.log('getDocument return')
    console.log(response)

    if (!resData) {
      resData = []
    }

    return resData
  } catch (error: any) {
    console.log('Editwork failed. ', error.message)
  }
}
