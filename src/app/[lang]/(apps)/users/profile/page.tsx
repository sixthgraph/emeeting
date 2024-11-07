// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

import { getServerSession } from 'next-auth'

import axios from 'axios'

// MUI Imports
import Grid from '@mui/material/Grid'

import { options } from '@/app/api/auth/[...nextauth]/options'

// Type Imports

// Component Imports
import UserLeftOverview from '@views/apps/user/profile/user-left-overview'
import UserRight from '@views/apps/user/profile/user-right'

import type { PricingPlanType } from '@/types/pages/pricingTypes'

const OverViewTab = dynamic(() => import('@views/apps/user/profile/user-right/overview'))
const SecurityTab = dynamic(() => import('@views/apps/user/profile/user-right/security'))
const BillingPlans = dynamic(() => import('@views/apps/user/profile/user-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/user/profile/user-right/notifications'))
const ConnectionsTab = dynamic(() => import('@views/apps/user/profile/user-right/connections'))

// Vars
const tabContentList = (
  data: PricingPlanType[],
  myactivitydata: any,
  myRouteListData: any
): { [key: string]: ReactElement } => ({
  overview: <OverViewTab data={myactivitydata} routeData={myRouteListData} />, // sg he
  security: <SecurityTab />,
  'billing-plans': <BillingPlans data={data} />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const getPricingData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/pricing`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const getMyActivityList = async () => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      token: session?.user.token,
      email: session?.user.email
    }

    const token = { token: session?.user.token }

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
      return 'Data not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const handleGetUserStat = async () => {
  const session = await getServerSession(options)

  try {
    const token = session?.user.token
    const email = session?.user.email

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

const getMyRouteList = async () => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      token: session?.user.token,
      email: session?.user.email
    }

    const token = { token: session?.user.token }

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

const UserViewTab = async () => {
  // Vars
  const data = await getPricingData()
  const myactivitydata = await getMyActivityList()
  const myRouteList = await getMyRouteList()
  const myStat = await handleGetUserStat()
  const activityData = myactivitydata?.data
  const myRouteListData = myRouteList?.data

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserLeftOverview myStat={myStat} />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRight tabContentList={tabContentList(data, activityData, myRouteListData)} />
      </Grid>
    </Grid>
  )
}

export default UserViewTab
