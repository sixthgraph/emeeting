// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
//import type { Data } from '@/types/pages/profileTypes'
//import { useParams } from 'next/navigation'

import { getServerSession } from 'next-auth'

import type { WorkinfoType } from '@/types/apps/workType'

// Component Imports
import WorkDetail from '@/views/apps/work'
import { options } from '@/app/api/auth/[...nextauth]/options'

import axios from '@/utils/axios'

// const ProfileTab = dynamic(() => import('@views/apps/work/profile'))
// const TeamsTab = dynamic(() => import('@views/apps/work/teams'))
// const ProjectsTab = dynamic(() => import('@views/apps/work/projects'))
// const ConnectionsTab = dynamic(() => import('@views/apps/work/connections'))

const FormTab = dynamic(() => import('@views/apps/work/form'))
const DocumentTab = dynamic(() => import('@views/apps/work/document'))
const ActivityTab = dynamic(() => import('@views/apps/work/activity'))

// Vars

const tabContentList = (data?: WorkinfoType): { [key: string]: ReactElement } => ({
  form: <FormTab data={data} />,
  document: <DocumentTab data={data} />,
  activity: <ActivityTab data={data} />

  // profile: <ProfileTab data={data?.users.profile} />,
  // teams: <TeamsTab data={data?.users.teams} />,
  // projects: <ProjectsTab data={data?.users.projects} />,
  // connections: <ConnectionsTab data={data?.users.connections} />
})

const getData = async (data: any) => {
  // Vars
  const session = await getServerSession(options)
  const wid = data.wid

  console.log('wid ===')
  console.log(wid)

  try {
    const token = {
      token: session?.user.token,
      wid: 'สพศก.ฝคส.4/2566'
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/list`, token, { headers })

    console.log('response getdata--------')
    console.log(response.data)

    if (response.data.message === 'success') {
      return response.data
    } else {
      throw new Error('Failed to fetch workdata')
    }
  } catch (err) {
    console.log(err)
  }

  // const serverSession = await getServerSession(options)
  // const token = serverSession?.user.token

  // const headers = {
  //   Authorization: `Bearer ${token}`,
  //   cache: 'force-cache'
  // }

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work`)

  // if (!res.ok) {
  //   throw new Error('Failed to fetch profileData')
  // }

  // console.log(res.json)
}

const workPage = async ({ searchParams }: any) => {
  // Vars

  const data = await getData({ searchParams })

  //console.log(data)

  return <WorkDetail workData={searchParams} data={data} tabContentList={tabContentList(data)} />
}

export default workPage
