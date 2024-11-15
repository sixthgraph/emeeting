import type { ReactElement } from 'react'

import dynamic from 'next/dynamic'

import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

import UserProfile from '@/views/pages/user-profile'

const OverviewTab = dynamic(() => import('@views/pages/user-profile/overview'))
const FeedTab = dynamic(() => import('@views/pages/user-profile/feed'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  overview: <OverviewTab />,
  feed: <FeedTab />
})

const handleGetUserInfo = async (token: any, email: any) => {
  try {
    const reqBody = {
      token: token,
      email: email
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/get-user-info`, reqBody)

    if (response.statusText === 'OK') {
      return response.data
    } else {
      return []
    }
  } catch (err) {
    console.log(err)
  }
}

const homePage = async () => {
  // Vars
  const session = await getServerSession(options)
  const token = session?.user.token
  const myEmail = session?.user.email
  const email = session?.user.email
  const userData = await handleGetUserInfo(token, email)

  userData.myEmail = myEmail

  return <UserProfile userData={userData} tabContentList={tabContentList()} />
}

export default homePage
