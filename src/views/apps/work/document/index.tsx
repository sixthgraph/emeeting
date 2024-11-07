// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports
//import type { ProfileTabType } from '@/types/pages/profileTypes'
import type { WorkinfoType } from '@/types/apps/workType'

// Component Imports
import ConnectionsTeams from './ConnectionsTeams'

const ProfileTab = ({ data }: { data?: WorkinfoType }) => {
  //TODO remove data not use
  console.log(data)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ConnectionsTeams />
      </Grid>
    </Grid>
  )
}

export default ProfileTab
