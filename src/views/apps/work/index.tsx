'use client'

// React Imports
import { useState } from 'react'
import type { ReactElement, SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Type Imports
import { CardHeader } from '@mui/material'

import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import UserProfileHeader from './UserProfileHeader'
import CustomTabList from '@core/components/mui/TabList'

const WorkDetail = ({
  workData,
  tabContentList,
  data
}: {
  workData: any
  tabContentList: { [key: string]: ReactElement }
  data: Data
}) => {
  // States
  const [activeTab, setActiveTab] = useState('form')

  console.log('workData ==== ')
  console.log(workData)

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={8}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {/* <UserProfileHeader data={data?.profileHeader} /> */}
            <UserProfileHeader workData={workData} data={data?.profileHeader} />
          </Grid>
          {activeTab === undefined ? null : (
            <Grid item xs={12} className='flex flex-col gap-6'>
              <TabContext value={activeTab}>
                <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                  <Tab
                    label={
                      <div className='flex items-center gap-1.5'>
                        <i className='tabler-article text-lg' />
                        E-Forms
                      </div>
                    }
                    value='form'
                  />
                  <Tab
                    label={
                      <div className='flex items-center gap-1.5'>
                        <i className='tabler-paperclip text-lg' />
                        Documents
                      </div>
                    }
                    value='document'
                  />
                  <Tab
                    label={
                      <div className='flex items-center gap-1.5'>
                        <i className='tabler-chart-bar text-lg' />
                        Activity
                      </div>
                    }
                    value='activity'
                  />
                  {/*
                  <Tab
                    label={
                      <div className='flex items-center gap-1.5'>
                        <i className='tabler-user-check text-lg' />
                        Profile
                      </div>
                    }
                    value='profile'
                  />
                   <Tab
                    label={
                      <div className='flex items-center gap-1.5'>
                        <i className='tabler-users text-lg' />
                        Teams
                      </div>
                    }
                    value='teams'
                  />
                  <Tab
                    label={
                      <div className='flex items-center gap-1.5'>
                        <i className='tabler-layout-grid text-lg' />
                        Projects
                      </div>
                    }
                    value='projects'
                  />
                  <Tab
                    label={
                      <div className='flex items-center gap-1.5'>
                        <i className='tabler-link text-lg' />
                        Connections
                      </div>
                    }
                    value='connections'
                  /> */}
                </CustomTabList>

                <TabPanel value={activeTab} className='p-0'>
                  {tabContentList[activeTab]}
                </TabPanel>
              </TabContext>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <Card>
          <CardHeader title='Messages' />
          <CardContent>Chat content</CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default WorkDetail
