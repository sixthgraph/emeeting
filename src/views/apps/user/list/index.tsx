import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType, RoleType } from '@/types/apps/userTypes'

// Component Imports
import UserListTable from './UserListTable'

const UserList = ({ userData, roleData }: { userData?: UsersType[]; roleData?: RoleType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={userData} roleData={roleData} />
      </Grid>
    </Grid>
  )
}

export default UserList
