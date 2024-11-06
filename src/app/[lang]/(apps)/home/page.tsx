import type { ReactElement } from 'react'

import dynamic from 'next/dynamic'

import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

import UserProfile from '@/views/pages/user-profile'

const OverviewTab = dynamic(() => import('@views/pages/user-profile/overview'))
const FeedTab = dynamic(() => import('@views/pages/user-profile/feed'))

// Vars
const tabContentList = (activityData?: any, myRouteListData?: any): { [key: string]: ReactElement } => ({
  overview: <OverviewTab activityData={activityData?.data} myRouteListData={myRouteListData?.data} />,
  feed: <FeedTab />
})

const getMyActivityList = async (token: any, email: any) => {
  try {
    const reqBody = {
      token: token,
      email: email
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/myactivitylist`, reqBody, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      const notFoundData = {
        message: 'unsuccess',
        success: true,
        data: []
      }

      return notFoundData
    }
  } catch (err) {
    console.log(err)
  }
}

const getMyRouteList = async (token: any, email: any) => {
  try {
    const reqBody = {
      token: token,
      email: email
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/my-route-list`, reqBody, { headers })

    const responseData = response.data

    return responseData
  } catch (err) {
    console.log(err)
  }
}

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

const handleGetUserStat = async (token: any, email: any) => {
  try {
    const reqBody = {
      token: token,
      email: email
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/get-my-stat`, reqBody)

    if (response.statusText === 'OK') {
      return response.data
    } else {
      return 'User not found'
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
  const myStat = await handleGetUserStat(token, email)
  const activityData = await getMyActivityList(token, email)
  const myRouteListData = await getMyRouteList(token, email)

  userData.myEmail = myEmail

  return (
    <UserProfile userData={userData} myStat={myStat} tabContentList={tabContentList(activityData, myRouteListData)} />
  )
}

export default homePage
