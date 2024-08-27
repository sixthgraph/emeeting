'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import WorkProfile from '../work/WorkProfile'
import WorkMessage from './WorkMessage'

const WorkDetailV2 = ({
  data,
  conditiondata,
  commentdata,
  notificationdata
}: {
  data: Data
  conditiondata: any
  commentdata: any
  notificationdata: any
}) => {
  const workData = data?.data

  const commentWorkData = {
    wid: workData.wid,
    registeruid: workData.registeruid
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={8}>
        <Grid container spacing={6}>
          <Grid item xs={12} className='flex flex-col gap-6'>
            <WorkProfile workData={workData} conditionData={conditiondata} notificationData={notificationdata} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <WorkMessage commentData={commentdata} commentWorkData={commentWorkData} />
      </Grid>
    </Grid>
  )
}

export default WorkDetailV2
