import { getServerSession } from 'next-auth'

import axios from 'axios'

import { options } from '@/app/api/auth/[...nextauth]/options'
import PositionList from '@/views/apps/position/list'

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

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/positions/list`, token, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      return 'Position not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const PositionListApp = async () => {
  // Vars
  const data = await getData()
  const positionData = data.data.detail

  return <PositionList positionData={positionData} />
}

export default PositionListApp
