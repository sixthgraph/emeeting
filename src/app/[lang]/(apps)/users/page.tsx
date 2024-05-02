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
      return response.data.data.detail
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

  return <UserList userData={data} />
}

export default UserListApp
