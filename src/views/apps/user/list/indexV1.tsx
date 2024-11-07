'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

import Grid from '@mui/material/Grid'

// Type Imports
import type { UsersType, RoleType, DepType } from '@/types/apps/userTypes'

// Component Imports
import UserListTable from './UserListTable'

const UserList = ({
  userData,
  roleData,
  depData,
  updateToken
}: {
  userData?: UsersType[]
  roleData?: RoleType[]
  depData?: DepType[]
  updateToken?: string
}) => {
  const { data: session, update } = useSession()
  const [tokenData, setTokenData] = useState(session?.user.token)

  async function updateSession() {
    await update({
      ...session,
      user: {
        ...session?.user,
        token: updateToken
      }
    })
  }

  useEffect(() => {
    updateSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData])

  if (tokenData !== updateToken) {
    setTokenData(updateToken)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={userData} roleData={roleData} depData={depData} />
      </Grid>
    </Grid>
  )
}

export default UserList
