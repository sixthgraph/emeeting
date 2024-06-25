// MUI Imports
import Grid from '@mui/material/Grid'

import type { ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports

import EformList from './EformList'

const EformTab = ({ data }: { data?: ProfileTabType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item lg={12} md={12} xs={12}>
        <EformList data={data} />
      </Grid>
    </Grid>
  )
}

export default EformTab
