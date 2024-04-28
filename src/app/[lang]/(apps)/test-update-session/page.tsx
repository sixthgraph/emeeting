'use client'
import { useState } from 'react'

import { useSession } from 'next-auth/react'

import { Button, Card, CardActions, CardContent } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

export default function TestUpdateSessionPage() {
  const { data: session, update } = useSession()
  const [tokenData, setTokenData] = useState(session?.user.token)

  async function updateSession() {
    //if (session) session.user.token = 'ddd'

    await update({
      ...session,
      user: {
        ...session?.user,
        token: tokenData
      }
    })
  }

  return (
    <>
      <h1 className='px-4 py-2'>Function updateSession (ServerSide)</h1>
      <div className='px-4 py-2'>
        <Card>
          <CardContent>
            <CustomTextField
              className='pb-4'
              label='Type New Token'
              fullWidth
              placeholder='Type new token data here....'
              onChange={e => setTokenData(e.target.value)}
            />
            <b>Your token : </b>
            {session?.user.token}
          </CardContent>
          <CardActions className='card-actions-dense'>
            <Button
              className='border bg-violet-600 text-white rounded px-4 py-2'
              onClick={updateSession}
              variant='text'
            >
              Update Session
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  )
}
