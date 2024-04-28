import axios from 'axios'

import { getServerSession } from 'next-auth/next'

import { Card, CardContent, Typography } from '@mui/material'

import { options } from '@/app/api/auth/[...nextauth]/options'

const getData = async () => {
  const session = await getServerSession(options)

  try {
    const token = { token: session?.user.token }
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/test`, token)

    if (response.data.message === 'success') {
      return response.data.data.detail
    } else {
      return 'User not found'
    }
  } catch (err) {
    console.log(err)
  }
}

export default async function Page() {
  const users = await getData()

  // console.log('Users list ====')
  // console.log(users)

  return (
    <div>
      <h1>Test call Routeflow-api with AXIOS</h1>
      <p>Example how to send (client side) token to API with method POST</p>
      <div>
        {users.map((user: any) => {
          return (
            <>
              <Card className='my-4'>
                <CardContent>
                  <Typography key={user.firstname}>
                    <b>Fullname :</b> {user.firstname} {user.lastname}
                  </Typography>
                  <Typography key={user.email}>
                    <b>email :</b> {user.email}
                  </Typography>
                </CardContent>
              </Card>
            </>
          )
        })}
      </div>
    </div>
  )
}
