import Grid from '@mui/material/Grid'

// Type Imports
import type { GroupType } from '@/types/apps/groupTypes'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import GroupListTable from './GroupListTable'

const GroupList = ({ groupData, userData }: { groupData?: GroupType[]; userData?: UsersType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <GroupListTable tableData={groupData} userData={userData} />
      </Grid>
    </Grid>
  )
}

export default GroupList
