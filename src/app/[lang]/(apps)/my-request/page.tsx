import { getServerSession } from 'next-auth'

// Component Imports
import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

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

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/my-request/list`, reqBody, { headers })

    console.log(response.data)

    return response.data
  } catch (err) {
    console.log(err)
  }
}

const myRequestPage = async () => {
  const data = await getData()

  console.log('my-items data------')
  console.log(data.detail)

  return <h1>For SG</h1>
}

export default myRequestPage
