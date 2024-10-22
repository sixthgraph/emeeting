// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports
import AboutOverview from './AboutOverview'
import ActivityTimeline from './ActivityTimeline'
import ConnectionsTeams from './ConnectionsTeams'
import ProjectsTable from './ProjectsTables'

const ProfileTab = ({ data, userData, myStat }: { data?: ProfileTabType; userData?: any; myStat: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ActivityTimeline />
      </Grid>
      <ConnectionsTeams connections={data?.connections} teamsTech={data?.teamsTech} />
      <Grid item xs={12}>
        <ProjectsTable projectTable={data?.projectTable} />
      </Grid>
    </Grid>
  )
}

export default ProfileTab
