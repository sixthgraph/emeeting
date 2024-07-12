'use client'

import { useEffect } from 'react'

import { Card, CardContent, CardHeader, Grid } from '@mui/material'

import CreateWorkProfile from './CreateWorkProfile'

const WorkCreate = ({ data }: { data: any }) => {
  useEffect(() => {
    if (window) {
      //window.sessionStorage.setItem('eformData', JSON.stringify(data))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={8}>
        <Grid container spacing={6}>
          <Grid item xs={12} className='flex flex-col gap-6'>
            <CreateWorkProfile workData={data} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <Card variant='outlined'>
          <CardHeader title='Messages' />
          <CardContent>Chat content</CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default WorkCreate
