// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Type Imports
//import type { Data } from '@/types/pages/profileTypes'
import type { WorkinfoType } from '@/types/apps/workType'
// Component Imports
import WorkDetail from '@/views/apps/work'

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

const getData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/work`)

  if (!res.ok) {
    throw new Error('Failed to fetch profileData')
  }

  return res.json()
}

const workPage = async ({ searchParams }: any) => {
  // Vars
  const data = await getData()

  return <WorkDetail workData={searchParams} data={data} tabContentList={tabContentList(data)} />
}

export default workPage
