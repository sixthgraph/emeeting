import { getServerSession } from 'next-auth'

// Component Imports
import { options } from '@/app/api/auth/[...nextauth]/options'

import axios from '@/utils/axios'
import WorkDetailV2 from '@/views/apps/workV2'

const getData = async ({
  wid,
  dep,
  workflowid,
  blockid
}: {
  wid?: any
  dep?: any
  workflowid?: any
  blockid?: any
}) => {
  // Vars
  const session = await getServerSession(options)

  try {
    const reqBody = {
      wid: wid,
      dep: dep,
      workflowid: workflowid,
      blockid: blockid,
      token: session?.user.token,
      email: session?.user.email
    }

    const headers = {
      Authorization: `Bearer ${reqBody.token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/list`, reqBody, { headers })

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
  // const wid = searchParams.wid
  // const dep = searchParams.dep

  const { wid, dep } = searchParams

  console.log('search params----')
  console.log(searchParams)

  const data = await getData({ wid, dep, workflowid, blockid })

  // return <WorkDetail workData={searchParams} data={data} tabContentList={tabContentList(data)} />
  return <WorkDetailV2 data={data} />
}

export default workPage
