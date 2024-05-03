import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType, RoleType, DepType } from '@/types/apps/userTypes'

// Component Imports
import UserListTable from './UserListTable'

const UserList = ({
  userData,
  roleData,
  depData
}: {
  userData?: UsersType[]
  roleData?: RoleType[]
  depData?: DepType[]
}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={userData} roleData={roleData} depData={depData} />
      </Grid>
    </Grid>
  )
}

export default UserList
