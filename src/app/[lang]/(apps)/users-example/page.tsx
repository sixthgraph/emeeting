// import UserList from '@views/apps/user/list'

import UserListExample from '@/views/apps/user/list/UserListExample'

const getData = async () => {
  // Vars
  // const res = await fetch(`${process.env.API_URL}/apps/user-list`, { cache: 'no-store' })
  const res = await fetch(`${process.env.API_URL}/apps/user-list`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
}

const UserListExampleApp = async () => {
  // Vars
  const data = await getData()

  return <UserListExample userData={data} />
}

export default UserListExampleApp
