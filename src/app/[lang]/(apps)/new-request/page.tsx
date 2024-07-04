import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'
import NewRequestList from '@/views/apps/new-request/list'

const getData = async () => {
  const session = await getServerSession(options)

  try {
    const token = { token: session?.user.token }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/new-request`, token, { headers })

    if (response.data.length > 0) {
      return response.data
    } else {
      return 'New request not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const newRequestPage = async () => {
  const data = await getData()

  //console.log(data)

  return <NewRequestList newRequestData={data} />
}

export default newRequestPage
