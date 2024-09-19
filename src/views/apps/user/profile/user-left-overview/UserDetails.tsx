'use client'
import { redirect } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import EditUserInfo from '@components/dialogs/edit-user-info'

// import ConfirmationDialog from '@components/dialogs/confirmation-dialog'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import CustomAvatar from '@core/components/mui/Avatar'
import type { UsersType } from '@/types/apps/userTypes'
import { getInitials } from '@/utils/getInitials'

const UserDetails = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/en/users/profile')
    }
  })

  // Vars
  const name = session?.user.name
  const email = session?.user.email
  const role: any = session?.user.role
  const roles = ['Admin', 'Worker', 'Viewer', 'Super User']
  const userAvatar: any = session?.user.avatar
  const userFullname: any = session?.user.name
  const userDep: any = session?.user.dep
  const userRole = roles[role - 1]
  const nameObj: any = name?.split(' ')

  let firstname: any = ''
  let lastname: any = ''

  if (nameObj) {
    firstname = nameObj[0]
    lastname = nameObj[1]
  }

  const userData = {
    name: name,
    firstname: firstname,
    lastname: lastname,
    fullName: name,
    email: email,
    password: '',
    avatar: userAvatar,
    avatarcolor: '',
    dep: userDep,
    position: '',
    status: 'active',
    role: role

    // userName: email,
    // billingEmail: email,
    // taxId: 'Tax-8894',
    // contact: '+1 (234) 464-0600',
    // language: ['English'],
    // country: 'Thailand',
    // useAsBillingAddress: true
  }

  const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
    children,
    color,
    variant
  })

  const getAvatar = (params: Pick<UsersType, 'avatar' | 'fullName'>) => {
    const { avatar, fullName } = params

    if (avatar) {
      return (
        <>
          <CustomAvatar variant='rounded' src={avatar} size={120} />
          <Typography variant='h5'>{`${userData.name}`}</Typography>
        </>
      )
    } else {
      return (
        <>
          <CustomAvatar variant='rounded' size={120}>
            {getInitials(fullName as string)}
          </CustomAvatar>
          <Typography variant='h5'>{`${userData.name}`}</Typography>
        </>
      )
    }
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-12 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-2'>
              <div className='flex flex-col items-center gap-4'>
                {session?.user && getAvatar({ avatar: userAvatar, fullName: userFullname })}
              </div>
              {/* <Chip label={userRole} color='secondary' size='small' variant='tonal' /> */}
              {userDep?.map((item: any, index: any) => {
                return (
                  <div key={index}>
                    <Chip
                      label={`${item.depname} / ${item.positionname}`}
                      color='secondary'
                      size='small'
                      variant='tonal'
                    />
                  </div>
                )
              })}
            </div>
            <div className='flex items-center justify-around flex-wrap gap-4'>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='tabler-checkbox' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>1.23k</Typography>
                  <Typography>Task Done</Typography>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='tabler-briefcase' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>568</Typography>
                  <Typography>Project Done</Typography>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Typography variant='h5'>Details</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Fullname:
                </Typography>
                <Typography>{userData.name}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Email:
                </Typography>
                <Typography>{userData.email}</Typography>
              </div>
              {/* <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Status
                </Typography>
                <Typography color='text.primary'>{userData.status}</Typography>
              </div> */}
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Role:
                </Typography>
                <Typography color='text.primary'>{userRole}</Typography>
              </div>
              {/* <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Tax ID:
                </Typography>
                <Typography color='text.primary'>{userData.taxId}</Typography>
              </div> */}
              {/* <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Contact:
                </Typography>
                <Typography color='text.primary'>{userData.contact}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Language:
                </Typography>
                <Typography color='text.primary'>{userData.language}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Country:
                </Typography>
                <Typography color='text.primary'>{userData.country}</Typography>
              </div> */}
            </div>
          </div>
          <div className='flex gap-4 justify-center'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Edit', 'primary', 'contained')}
              dialog={EditUserInfo}
              dialogProps={{ data: userData }}
            />
            {/* <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Suspend', 'error', 'tonal')}
              dialog={ConfirmationDialog}
              dialogProps={{ type: 'suspend-account' }}
            /> */}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetails
