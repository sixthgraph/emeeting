import { headers } from 'next/headers'

import { Card, CardContent, Typography } from '@mui/material'

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test2`, {
      headers: headers()
    })

    const data = await res.json()

    return data.data.detail
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
      <h1>Test call Routeflow-api with FETCH</h1>
      <p>Example how use FETCH call API with method GET and API getToken by Server side</p>
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
