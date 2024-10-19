// MUI Imports
import Grid from '@mui/material/Grid'

import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'

// Component Imports
import UserDetails from './UserDetails'
import axios from '@/utils/axios'

const handleGetUserInfo = async (token: any, email: any) => {
  try {
    const reqBody = {
      token: token,
      email: email
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/get-user-info`, reqBody)

    if (response.statusText === 'OK') {
      return response.data
    } else {
      return 'User not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const UserLeftOverview = async ({ myStat }: { myStat?: any }) => {
  const session = await getServerSession(options)
  const token = session?.user.token
  const email = session?.user.email
  const userInfo = await handleGetUserInfo(token, email)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserDetails myStatData={myStat} userInfoData={userInfo} />
      </Grid>
      <Grid item xs={12}>
        {/* <UserPlan /> */}
      </Grid>
    </Grid>
  )
}

export default UserLeftOverview
