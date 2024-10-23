'use client'

import { Card, CardContent, Grid } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'

// Styles imports
import { useSession } from 'next-auth/react'

import styles from './styles.module.css'
import CustomTextField from '@core/components/mui/TextField'
import SamplePostCard from './SamplePostCard'

// Styled CustomTextField component
const CustomTextFieldStyled = styled(CustomTextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiInputBase-root.MuiFilledInput-root': {
    width: '100%',
    backgroundColor: 'var(--mui-palette-background-paper) !important'
  },
  [theme.breakpoints.up('sm')]: {
    width: '55%'
  }
}))

const FeedTab = () => {
  const { data: session } = useSession()
  const fullname = session?.user.name
  const avatar = session?.user.avatar

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className={classnames(' bg-transparent bg-cover', styles.bgImage)} elevation={0}>
          {/* <CardContent className='flex flex-col items-center is-full text-center !plb-[5.8125rem] pli-5'> */}
          <CardContent className='flex flex-col items-center is-full text-center  pli-5'>
            {/* <Typography variant='h4' className='mbe-2.5'>
              Hello, how can we help?
            </Typography> */}
            {/* <Typography className='mbe-4'>or choose a category to quickly find the help you need</Typography> */}
            <div className='flex flex-row is-full pli-5 items-center'>
              {avatar ? (
                <Avatar src={avatar} className='mr-2' alt='Victor Anderson' />
              ) : (
                <Avatar src='/images/avatars/avatar.png' className='mr-2' alt='Victor Anderson' />
              )}
              <CustomTextFieldStyled
                className='is-full sm:max-is-[55%] md:max-is-[600px]'
                placeholder={`What do you think ${fullname}`}
                value=''
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <SamplePostCard />
      </Grid>
    </Grid>
  )
}

export default FeedTab
