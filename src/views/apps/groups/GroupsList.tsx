import Grid from '@mui/material/Grid'

// Type Imports
import type { GroupType } from '@/types/apps/groupTypes'

// Component Imports

import GroupListExampleTable from './GroupListTable'

const GroupListExample = ({ groupData }: { groupData?: GroupType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <GroupListExampleTable tableData={groupData} />
      </Grid>
    </Grid>
  )
}

export default GroupListExample
