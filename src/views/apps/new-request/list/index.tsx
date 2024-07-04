'use client'

import Grid from '@mui/material/Grid'

import NewReqListTable from '../NewReqListTable'

import type { NewReqType } from '@/types/apps/newRequestTypes'

const NewRequestList = ({ newRequestData }: { newRequestData?: NewReqType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <NewReqListTable tableData={newRequestData}></NewReqListTable>
      </Grid>
    </Grid>
  )
}

export default NewRequestList
