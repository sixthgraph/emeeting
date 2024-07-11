'use client'

import Grid from '@mui/material/Grid'

// Type Imports
import type { MyrequestType } from '@/types/apps/myrequestTypes'
import type { DepType } from '@/types/apps/userTypes'

import MyrequestListTable from './MyrequestListTable'

const MyrequestList = ({ myrequestData, depData }: { myrequestData?: MyrequestType[]; depData?: DepType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MyrequestListTable tableData={myrequestData} depData={depData} />
      </Grid>
    </Grid>
  )
}

export default MyrequestList
