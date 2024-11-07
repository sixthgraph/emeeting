import { getServerSession } from 'next-auth'

// Component Imports
import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

import SentList from '@/views/apps/sent'

const getData = async () => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      token: session?.user.token,
      email: session?.user.email
    }

    const headers = {
      Authorization: `Bearer ${reqBody.token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sent/list`, reqBody, { headers })

    return response.data
  } catch (err) {
    console.log(err)
  }
}

const sentPage = async () => {
  const data = await getData()

  return <SentList sentData={data.detail}></SentList>
}

export default sentPage
