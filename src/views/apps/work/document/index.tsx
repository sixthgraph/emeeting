// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
import type { ProfileTabType } from '@/types/pages/profileTypes'

// Component Imports
import ConnectionsTeams from './ConnectionsTeams'

const ProfileTab = ({ data }: { data?: ProfileTabType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ConnectionsTeams connections={data?.connections} teamsTech={data?.teamsTech} />
      </Grid>
    </Grid>
  )
}

export default ProfileTab
