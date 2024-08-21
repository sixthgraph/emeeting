'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Type Imports
import { CardHeader } from '@mui/material'

import type { Data } from '@/types/pages/profileTypes'

// Component Imports
import WorkProfile from '../work/WorkProfile'
import WorkMessage from './WorkMessage'

const WorkDetailV2 = ({ data, conditiondata, commentdata }: { data: Data; conditiondata: any; commentdata: any }) => {
  const workData = data?.data

  return (
    <Grid container spacing={6}>
      <Grid item xs={8}>
        <Grid container spacing={6}>
          <Grid item xs={12} className='flex flex-col gap-6'>
            <WorkProfile workData={workData} condionData={conditiondata} commentData={commentdata} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <Card variant='outlined'>
          <CardHeader title='Messages' />
          <CardContent>
            <WorkMessage />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default WorkDetailV2
