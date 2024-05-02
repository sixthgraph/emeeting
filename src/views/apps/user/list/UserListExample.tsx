import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersTypeExample } from '@/types/apps/userTypes'

// Component Imports

import UserListExampleTable from './UserListExampleTable'

const UserListExample = ({ userData }: { userData?: UsersTypeExample[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListExampleTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default UserListExample
