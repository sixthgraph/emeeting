// Remember you must use an AuthProvider for
// client components to useSession

'use client'

import { redirect } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { Button, Grid, Typography } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'

export default function Page() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/en/dashboard')
    }
  })

  const notify = () => toast('Wow so easy !')

  return (
    <Grid container spacing={6} wrap='nowrap'>
      <Grid item xs={12}>
        Dashboard page , Welcome {session?.user && session.user?.name}
        <Grid item xs={6} sx={{ mt: 10 }} zeroMinWidth>
          Your Token :
          <Typography style={{ overflowWrap: 'break-word' }}>{session?.user && session.user?.token}</Typography>
          <Button variant='contained' onClick={notify} className='mr-2' color='info' type='submit'>
            toast
          </Button>
          <ToastContainer />
        </Grid>
      </Grid>
    </Grid>
  )
}
