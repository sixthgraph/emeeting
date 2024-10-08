'use server'

import { getServerSession } from 'next-auth'

import axios from 'axios'

import { options } from '@/app/api/auth/[...nextauth]/options'
import ViewAppList from '@/views/apps/my-app/view'

const getData = async (workflowid: any) => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      workflowid: workflowid,
      token: session?.user.token
    }

    const token = { token: session?.user.token }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/my-app/get`, reqBody, {
      headers
    })

    return response.data
  } catch (err) {
    console.log(err)
  }
}

const viewMyAppPage = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id)

  return <ViewAppList data={data} />
}

export default viewMyAppPage
