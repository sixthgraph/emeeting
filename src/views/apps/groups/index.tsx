'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Grid from '@mui/material/Grid'

// Type Imports
import type { GroupType } from '@/types/apps/groupTypes'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import GroupListTable from './GroupListTable'

const GroupList = ({
  groupData,
  updateToken,
  userData,
  email
}: {
  groupData?: GroupType[]
  updateToken?: string
  userData?: UsersType[]
  email?: string
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
    console.log('update token')
    setTokenData(updateToken)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <GroupListTable tableData={groupData} userData={userData} email={email} />
      </Grid>
    </Grid>
  )
}

export default GroupList
