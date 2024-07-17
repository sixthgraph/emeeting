// Remember you must use an AuthProvider for
// client components to useSession

'use client'

import { redirect } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { Grid, Typography } from '@mui/material'

export default function Page() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/en/dashboard')
    }
  })

  console.log('session ======== >>>>>>', session)
  console.log('dashboard load')

  return (
    <Grid container spacing={6} wrap='nowrap'>
      <Grid item xs={12}>
        Dashboard page , Welcome {session?.user && session.user?.name}
        <Grid item xs={6} sx={{ mt: 10 }} zeroMinWidth>
          Your Token :
          <Typography style={{ overflowWrap: 'break-word' }}>{session?.user && session.user?.token}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
