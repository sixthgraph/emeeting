import { getServerSession } from 'next-auth'
import axios from 'axios'

import UserList from '@views/apps/user/list'
import { options } from '@/app/api/auth/[...nextauth]/options'

const getData = async () => {
  const session = await getServerSession(options)

  try {
    const token = { token: session?.user.token }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/list`, token)

    if (response.data.message === 'success') {
      // console.log('user list front end return roles')
      // console.log(response.data.data.roles)
      // console.log('user list front end return user')
      // console.log(response.data.data.detail)

      return response.data.data
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
  const users = data.detail
  const roles = data.roles
  const deps = data.deps

  return <UserList userData={users} roleData={roles} depData={deps} />
}

export default UserListApp
