'use client'

import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TabList from '@mui/lab/TabList'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Type Imports
import { Box } from '@mui/material'

import type { ProfileHeaderType } from '@/types/pages/profileTypes'

const WorkProfileHeader = ({ workData, data }: { workData: any; data?: ProfileHeaderType }) => {
  console.log('workData ====')
  console.log(workData)

  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <>
      <Card variant='outlined'>
        {/* <CardMedia image={data?.coverImg} className='bs-[250px]' /> */}
        <CardContent className='flex gap-5 item-stretch flex-col'>
          <div className='flex items-stretch gap-4 w-full rounded-lg bg-stripes-cyan text-center'>
            <div className='rounded-bs-md item-start border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
              <img height={55} width={55} src={data?.profileImg} className='rounded' alt='Profile Background' />
            </div>
            <div className='flex-1 flex flex-col items-start justify-start'>
              <Typography className='text-xs'>Created by:</Typography>
              <Typography className='font-bold'>{workData?.firstname + ' ' + workData?.lastname}</Typography>
              <Typography className='text-xs mt-2'>Work ID:</Typography>
              <Typography className='font-bold'>{workData.wid}</Typography>
            </div>
            <div className='flex-1 flex flex-col items-start justify-start'>
              <Typography className='text-xs'>Created:</Typography>
              <Typography className='font-bold'>{workData?.Registerdate}</Typography>
              <Typography className='text-xs mt-2'>Subject:</Typography>
              <Typography className='font-bold'>{workData.subject}</Typography>
            </div>
            <div className='flex-1 flex items-start justify-end'>
              <Typography className='font-medium'>Work progress 50%</Typography>
            </div>
          </div>
          <div className='flex flex-1'>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value}>
                <Box>
                  <TabList onChange={handleChange} aria-label='lab API tabs example'>
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5'>
                          <i className='tabler-article text-lg' />
                          E-Forms
                        </div>
                      }
                      value='e'
                    />
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5'>
                          <i className='tabler-paperclip text-lg' />
                          Documents
                        </div>
                      }
                      value='2'
                    />
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5'>
                          <i className='tabler-chart-bar text-lg' />
                          Activity
                        </div>
                      }
                      value='3'
                    />
                  </TabList>
                </Box>
                <TabPanel value='1'>Item One</TabPanel>
                <TabPanel value='2'>Item Two</TabPanel>
                <TabPanel value='3'>Item Three</TabPanel>
              </TabContext>
            </Box>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default WorkProfileHeader
