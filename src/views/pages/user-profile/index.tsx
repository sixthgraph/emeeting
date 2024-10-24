'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ReactElement, SyntheticEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import UserProfileHeader from './UserProfileHeader'
import CustomTabList from '@core/components/mui/TabList'
import AboutOverview from './profile/AboutOverview'

const UserProfile = ({
  tabContentList,
  userData,
  myStat
}: {
  tabContentList: { [key: string]: ReactElement }
  userData?: any
  myStat?: any
}) => {
  // States
  const [activeTab, setActiveTab] = useState('feed')
  const [myProfile, setMyProfile] = useState(false)

  useEffect(() => {
    if (userData.email == userData.myEmail) {
      setMyProfile(true)
      setActiveTab('overview')
    }
  }, [userData])

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader userData={userData} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={4} md={5}>
            <AboutOverview userData={userData} myStat={myStat} />
          </Grid>
          <Grid item xs={12} lg={8} md={7} spacing={6}>
            {activeTab === undefined ? null : (
              <Grid item xs={12} className='flex flex-col gap-6'>
                <TabContext value={activeTab}>
                  {
                    myProfile && (
                      <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                        <Tab
                          label={
                            <div className='flex items-center gap-1.5'>
                              <i className='tabler-dashboard text-lg' />
                              Overview
                            </div>
                          }
                          value='overview'
                        />
                        <Tab
                          label={
                            <div className='flex items-center gap-1.5'>
                              <i className='tabler-news text-lg' />
                              News Feed
                            </div>
                          }
                          value='feed'
                        />
                        {/* <Tab
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
                    />  */}
                      </CustomTabList>
                    )

                    // : (
                    //   <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                    //     <Tab
                    //       label={
                    //         <div className='flex items-center gap-1.5'>
                    //           <i className='tabler-news text-lg' />
                    //           News Feed
                    //         </div>
                    //       }
                    //       value='feed'
                    //     />
                    //   </CustomTabList>
                    // )
                  }

                  <TabPanel value={activeTab} className='p-0'>
                    {tabContentList[activeTab]}
                  </TabPanel>
                </TabContext>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserProfile
