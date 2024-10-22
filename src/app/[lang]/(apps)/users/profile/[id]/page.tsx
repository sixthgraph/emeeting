import type { ReactElement } from 'react'

import dynamic from 'next/dynamic'

import { getServerSession } from 'next-auth'

// Type Imports
import type { Data } from '@/types/pages/profileTypes'

import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

// import type { PricingPlanType } from '@/types/pages/pricingTypes'
import UserProfile from '@/views/pages/user-profile'

// Data Imports
import { getProfileData } from '@/app/server/action'

const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile'))
const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams'))
const ProjectsTab = dynamic(() => import('@views/pages/user-profile/projects'))
const ConnectionsTab = dynamic(() => import('@views/pages/user-profile/connections'))

// Vars
const tabContentList = (data?: Data, userData?: any, myStat?: any): { [key: string]: ReactElement } => ({
  profile: <ProfileTab data={data?.users.profile} userData={userData} myStat={myStat} />,
  teams: <TeamsTab data={data?.users.teams} />,
  projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
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
      return 'User not found'
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

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  // Vars
  const session = await getServerSession(options)
  const token = session?.user.token
  const email = decodeURIComponent(params.id)
  const userData = await handleGetUserInfo(token, email)

  console.log('user data')
  console.log(userData)

  const data = await getProfileData()
  const myStat = await handleGetUserStat(token, email)

  return <UserProfile userData={userData} tabContentList={tabContentList(data, userData, myStat)} />
}

export default ProfilePage
