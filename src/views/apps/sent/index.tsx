'use client'

import Grid from '@mui/material/Grid'

// Type Imports
import type { SentType } from '@/types/apps/sentTypes'
import type { DepType } from '@/types/apps/userTypes'

import SentListTable from './sentListTable'

const SentList = ({ sentData, depData }: { sentData?: SentType[]; depData?: DepType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SentListTable tableData={sentData} depData={depData} />
      </Grid>
    </Grid>
  )
}

export default SentList
