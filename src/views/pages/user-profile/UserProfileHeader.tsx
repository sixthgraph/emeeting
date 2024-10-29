'use client'

import { useEffect, useState } from 'react'

import { redirect, useParams } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Dialog, DialogContent, DialogTitle } from '@mui/material'

import CustomBadge from '@/@core/components/mui/Badge'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import AvatarUploader from '@/views/apps/user/profile/user-left-overview/AvatarUpload'
import axios from '@/utils/axios'
import CoverProfileUploader from '@/views/apps/user/profile/user-left-overview/coverProfileUpload'

// Type Imports

const UserProfileHeader = ({ userData }: { userData?: any }) => {
  const params = useParams()
  const { lang: locale } = params
  const [open, setOpen] = useState<boolean>(false)
  const [uploadMode, setUploadMode] = useState<any>('')
  const [data, setData] = useState(...[userData])
  const [myProfile, setMyProfile] = useState<boolean>(false)

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin?callbackUrl=/en/home`)
    }
  })

  const token = session?.user.token
  const email = session?.user.email

  useEffect(() => {
    if (email === data?.email) {
      setMyProfile(true)
    }
  }, [data?.email, email])

  console.log('userData')
  console.log(userData)

  const formatshortdate = (date: any) => {
    const m_th_names = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย',
      'ธ.ค.'
    ]

    const m_en_names = ['Jan', 'Feb', 'Mar', ' Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const d = new Date(date),
      curr_date = d.getDate(),
      curr_month = d.getMonth(),
      curr_year: number = d.getFullYear() + 543

    const formattedDate = d.toLocaleString()
    const curr_time = formattedDate.split(',')[1]

    if (locale == 'th') {
      return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year + ' ' + curr_time
    }

    return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year + ' ' + curr_time
  }

  const handleGetUserInfo = async () => {
    try {
      const reqBody = {
        token: token,
        email: email
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/get-user-info`, reqBody)

      // console.log('handleGetUserInfo return')
      // console.log(response.data)

      return response.data
    } catch (err) {
      console.log(err)
    }
  }

  const handleOpenUploadAvatar = () => {
    console.log('upload avatar')
    setUploadMode('avatar')
    setOpen(true)
  }

  const handleOpenUploadCover = () => {
    console.log('upload cover')
    setUploadMode('cover')
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    handleGetUserInfo().then(r => {
      console.log('r')
      console.log(r)
      setData(r)
    })
    setUploadMode('')
  }

  return (
    <>
      <Card>
        {/* <CardMedia image='/images/pages/profile-banner.png' className='bs-[250px]' /> */}
        <CardMedia
          image={
            data.coverprofile !== ''
              ? data?.coverprofile
              : process.env.NEXT_PUBLIC_BASEPATH + '/images/pages/profile-banner.png'
          }
          className='bs-[250px]'
        />
        <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
          <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
            {myProfile ? (
              <CustomBadge
                color='primary'
                className='cursor-pointer'
                onClick={() => handleOpenUploadAvatar()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<i className='tabler-pencil text-sm' />}
              >
                <img
                  height={120}
                  width={120}
                  src={data?.avatar ? data.avatar : process.env.NEXT_PUBLIC_BASEPATH + '/images/avatars/avatar.png'}
                  className='rounded'
                  alt='Profile Background'
                />
              </CustomBadge>
            ) : (
              <img
                height={120}
                width={120}
                src={data?.avatar ? data.avatar : process.env.NEXT_PUBLIC_BASEPATH + '/images/avatars/avatar.png'}
                className='rounded'
                alt='Profile Background'
              />
            )}
          </div>
          <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
            <div className='flex flex-col items-center sm:items-start gap-2'>
              <Typography variant='h4'>
                {data?.firstname} {data?.lastname}
              </Typography>
              <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
                {data &&
                  data.dep?.map((item: any, index: any) => (
                    <div key={index} className='flex items-center gap-2'>
                      <i className='tabler-shield' />
                      <Typography className='font-medium'>
                        {item.depname} / {item.positionname}
                      </Typography>
                    </div>
                  ))}
                {/* <div className='flex items-center gap-2'>
                <i className='tabler-map-pin' />
                <Typography className='font-medium'>{data?.location}</Typography>
              </div> */}
                <div className='flex items-center gap-2'>
                  <i className='tabler-calendar' />
                  <Typography className='font-medium'>{formatshortdate(data?.Created_At)}</Typography>
                </div>
              </div>
            </div>
            {myProfile ? (
              <Button variant='contained' onClick={handleOpenUploadCover} className='flex gap-2'>
                {/* <i className='tabler-user-check !text-base'></i> */}
                <span>Change Cover</span>
              </Button>
            ) : (
              <Button variant='contained' className='flex gap-2'>
                <i className='tabler-message-circle !text-base'></i>
                <span>Send Message</span>
              </Button>
            )}
            {/* <Button variant='contained' className='flex gap-2'>
              <i className='tabler-user-check !text-base'></i>
              <span>Connected</span>
            </Button> */}
          </div>
        </CardContent>
      </Card>
      <Dialog
        disableEscapeKeyDown
        aria-labelledby='customized-dialog-title'
        open={open}
        PaperProps={{ sx: { overflow: 'visible' } }}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='customized-dialog-title'>
          {uploadMode === 'avatar' && (
            <Typography variant='h5' component='span'>
              Upload Picture Profile
            </Typography>
          )}
          {uploadMode === 'cover' && (
            <Typography variant='h5' component='span'>
              Upload Cover Profile
            </Typography>
          )}
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <div className='align-middle border-dashed border-2 border-gray-300 min-h-[20rem] min-w-[30rem]'>
            <div className='mt-10 align-middle'>
              {uploadMode === 'avatar' && (
                <AvatarUploader
                  handleClose={() => {
                    handleClose()
                  }}
                />
              )}
              {uploadMode === 'cover' && (
                <CoverProfileUploader
                  handleClose={() => {
                    handleClose()
                  }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserProfileHeader
