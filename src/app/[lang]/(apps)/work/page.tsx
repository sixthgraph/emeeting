import { getServerSession } from 'next-auth'

// Component Imports
import { options } from '@/app/api/auth/[...nextauth]/options'

import axios from '@/utils/axios'
import WorkDetailV2 from '@/views/apps/workV2'

const getData = async (data: any) => {
  // Vars
  const session = await getServerSession(options)

  try {
    const token = {
      token: session?.user.token,
      wid: data.wid
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/list`, token, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      throw new Error('Failed to fetch workdata')
    }
  } catch (err) {
    console.log(err)
  }
}

const workPage = async ({ searchParams }: any) => {
  const wid = searchParams.wid
  const data = await getData({ wid })

  // return <WorkDetail workData={searchParams} data={data} tabContentList={tabContentList(data)} />
  return <WorkDetailV2 data={data} />
}

export default workPage
