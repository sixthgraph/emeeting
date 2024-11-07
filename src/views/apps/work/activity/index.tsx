// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { WorkinfoType } from '@/types/apps/workType'

// Component Imports
import ActivityTimeline from './ActivityTimeline'

const ActivityTab = ({ data }: { data?: WorkinfoType }) => {
  //TODO remove data not use
  console.log(data)

  return (
    <Grid container spacing={6}>
      <Grid item lg={12} md={12} xs={12}>
        <ActivityTimeline />
      </Grid>
    </Grid>
  )
}

export default ActivityTab
