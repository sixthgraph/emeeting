import { getServerSession } from 'next-auth'

// Component Imports
// import { Card, CardContent, Typography } from '@mui/material'

import { options } from '@/app/api/auth/[...nextauth]/options'

import axios from '@/utils/axios'
import WorkCreate from '@/views/apps/workV2/create'

// import WorkDetailV2 from '@/views/apps/workV2'

const getData = async ({ dep, rid, pid }: { wid?: any; dep?: any; rid?: any; pid?: any }) => {
  // Vars
  const session = await getServerSession(options)

  try {
    const reqBody = {
      dep: dep,
      pid: pid,
      rid: rid,
      token: session?.user.token,
      email: session?.user.email
    }

    const headers = {
      Authorization: `Bearer ${reqBody.token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/get`, reqBody, { headers })

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
  const { wid, dep, rid, pid } = searchParams
  const data = await getData({ wid, dep, rid, pid })

  return <WorkCreate data={data.data} nodeData={data.nodeData} docData={data.docData} />
}

export default workPage
