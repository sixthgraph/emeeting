import { getServerSession } from 'next-auth'

// Component Imports
import { options } from '@/app/api/auth/[...nextauth]/options'

import axios from '@/utils/axios'
import WorkDetailV2 from '@/views/apps/workV2'

const getData = async ({ wid, dep, wip }: { wid?: any; dep?: any; wip?: any }) => {
  // Vars
  const session = await getServerSession(options)

  try {
    const reqBody = {
      wid: wid,
      dep: dep,
      wip: wip,
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
      return response
    } else {
      throw new Error('Failed to fetch workdata')
    }
  } catch (err: any) {
    console.log('--work/list response ---' + err)

    // console.log(err)

    //throw new Error(err.message)
  }
}

const workPage = async ({ searchParams }: any) => {
  const { wid, dep, wip } = searchParams
  const res = await getData({ wid, dep, wip })
  const data = res?.data
  const conditionData = res?.data.conditionData
  const commentData = res?.data.commentData
  const documentData = res?.data.documentData
  const notificationData = res?.data.notificationData
  const nodeData = res?.data.nodeData

  console.log('---page res worklist')
  console.log(notificationData)

  if (data) {
    return (
      <WorkDetailV2
        data={data}
        conditiondata={conditionData}
        commentdata={commentData}
        documentdata={documentData}
        nodedata={nodeData}
        notificationdata={notificationData}
      />
    )
  } else {
    return <>!!! Work Data not found !!!</>
  }

  // return <WorkDetail workData={searchParams} data={data} tabContentList={tabContentList(data)} />
}

export default workPage
