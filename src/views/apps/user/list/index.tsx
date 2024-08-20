//'use client'

import Grid from '@mui/material/Grid'

//import UpdateToken from '@/components/updateToken'

// Type Imports
import type { UsersType, RoleType, DepType } from '@/types/apps/userTypes'

// Component Imports
import UserListTable from './UserListTable'

const UserList = ({
  userData,
  roleData,
  depData

  //updateToken
}: {
  userData?: UsersType[]
  roleData?: RoleType[]
  depData?: DepType[]

  //updateToken?: string
}) => {
  // function for update Token
  //UpdateToken(updateToken)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={userData} roleData={roleData} depData={depData} />
      </Grid>
    </Grid>
  )
}

export default UserList
