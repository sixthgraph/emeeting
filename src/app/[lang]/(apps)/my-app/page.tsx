import { getServerSession } from 'next-auth'

import MyAppList from '@/views/apps/my-app'
import axios from '@/utils/axios'
import { options } from '@/app/api/auth/[...nextauth]/options'

const getMyAppData = async () => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      token: session?.user.token
    }

    const headers = {
      Authorization: `Bearer ${reqBody.token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/my-app/list`, reqBody, { headers })

    return response.data
  } catch (err) {
    console.log(err)
  }
}

const myAppPage = async () => {
  const appData: any = await getMyAppData()

  return <MyAppList data={appData} />
}

export default myAppPage
