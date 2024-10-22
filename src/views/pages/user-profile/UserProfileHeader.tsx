'use client'

import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports

const UserProfileHeader = ({ userData }: { userData?: any }) => {
  const params = useParams()
  const { lang: locale } = params

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

  return (
    <Card>
      {/* <CardMedia image='/images/pages/profile-banner.png' className='bs-[250px]' /> */}
      <CardMedia
        image={userData.coverprofile !== '' ? userData?.coverprofile : '/images/pages/profile-banner.png'}
        className='bs-[250px]'
      />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <img height={120} width={120} src={userData?.avatar} className='rounded' alt='Profile Background' />
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>
              {userData?.firstname} {userData?.lastname}
            </Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              {userData?.dep.map((item: any, index: any) => (
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
                <Typography className='font-medium'>{formatshortdate(userData?.Created_At)}</Typography>
              </div>
            </div>
          </div>
          <Button variant='contained' className='flex gap-2'>
            <i className='tabler-user-check !text-base'></i>
            <span>Connected</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
