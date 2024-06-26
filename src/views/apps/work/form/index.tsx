// MUI Imports
import Grid from '@mui/material/Grid'

import type { ProfileTabType } from '@/types/pages/profileTypes'
import type { WorkinfoType } from '@/types/apps/workType'
import type { EFORM_DATA } from '@/types/apps/workType'
// Component Imports

import EformList from './EformList'

const EformTab = ({ data }: { data?: WorkinfoType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item lg={12} md={12} xs={12}>
        <EformList data={data} />
      </Grid>
    </Grid>
  )
}

export default EformTab
