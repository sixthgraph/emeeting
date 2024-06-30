import { getServerSession } from 'next-auth'

import axios from 'axios'

import GroupList from '@views/apps/groups'
import { options } from '@/app/api/auth/[...nextauth]/options'

const getData = async () => {
  const session = await getServerSession(options)

  try {
    const token = { token: session?.user.token }

    //const email = { email: session?.user.email }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/list`, token, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      return 'Group not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const getDataUser = async () => {
  const session = await getServerSession(options)

  try {
    const token = { token: session?.user.token }

    //const email = { email: session?.user.email }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const userinfo = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/list`, token, { headers })

    if (userinfo.data.message === 'success') {
      return userinfo.data
    } else {
      return 'User not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const GroupListApp = async () => {
  // Vars
  const data = await getData()
  const usersData = await getDataUser()
  const groupData = data.data.detail
  const updateToken = data.token
  const email = data.email
  const userData = usersData.data.detail

  return <GroupList groupData={groupData} updateToken={updateToken} userData={userData} email={email} />
}

export default GroupListApp
