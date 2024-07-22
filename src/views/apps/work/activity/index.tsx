// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { WorkinfoType } from '@/types/apps/workType'

// Component Imports
import ActivityTimeline from './ActivityTimeline'

const ActivityTab = ({ data }: { data?: WorkinfoType }) => {
  //console.log(data)
  console.log(data?.Activities)

  return (
    <Grid container spacing={6}>
      <Grid item lg={12} md={12} xs={12}>
        <ActivityTimeline />
      </Grid>
    </Grid>
  )
}

export default ActivityTab
