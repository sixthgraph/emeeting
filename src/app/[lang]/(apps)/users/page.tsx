import { getServerSession } from 'next-auth'
import axios from 'axios'

import UserList from '@views/apps/user/list'
import { options } from '@/app/api/auth/[...nextauth]/options'

const getData = async () => {
  const session = await getServerSession(options)

  try {
    const token = { token: session?.user.token }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/list`, token, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      return 'User not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const UserListApp = async () => {
  // Vars
  const data = await getData()
  const users = data.data.detail
  const roles = data.data.roles
  const deps = data.data.deps

  //const updateToken = data.token

  return <UserList userData={users} roleData={roles} depData={deps} />
}

export default UserListApp
