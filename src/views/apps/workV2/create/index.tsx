'use client'

import { useEffect } from 'react'

import { Grid } from '@mui/material'

import CreateWorkProfile from './CreateWorkProfile'

const WorkCreate = ({ data, nodeData, docData }: { data: any; nodeData: any; docData: any }) => {
  console.log('nodeData')
  console.log(nodeData)
  console.log('docData')
  console.log(docData)

  useEffect(() => {
    if (window) {
      //window.sessionStorage.setItem('eformData', JSON.stringify(data))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} className='flex flex-col gap-6'>
            <CreateWorkProfile workData={data} />
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={4}>
        <Card variant='outlined'>
          <CardHeader title='Messages' />
          <CardContent>Chat content</CardContent>
        </Card>
      </Grid> */}
    </Grid>
  )
}

export default WorkCreate
