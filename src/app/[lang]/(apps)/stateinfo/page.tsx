import { getServerSession } from 'next-auth'

import axios from 'axios'

import { options } from '@/app/api/auth/[...nextauth]/options'
import StateinfoList from '@/views/apps/stateinfo/list'

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

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stateinfos/list`, token, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      return 'Stateinfo not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const StateinfoListApp = async () => {
  // Vars
  const data = await getData()
  const stateinfoData = data.data.detail

  return <StateinfoList stateinfoData={stateinfoData} />
}

export default StateinfoListApp
