'use client'

// MUI Imports
import { useParams } from 'next/navigation'
import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import type { TimelineProps } from '@mui/lab/Timeline'

// Component Imports
import { Chip } from '@mui/material'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const UserActivityTimeLine = ({ data }: { data?: any }) => {
  const { lang: locale } = useParams()

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

    if (locale == 'th' || locale == 'en') {
      return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year + ' ' + curr_time
    }

    return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year + ' ' + curr_time
  }

  return (
    <>
      <Card className='mb-5'>
        <CardHeader title='User Activity Timeline' />
        <CardContent>
          <Timeline>
            {data &&
              data.map((item: any, index: any) => {
                if (index < 5) {
                  return (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color='primary' />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                          <Typography className='font-medium' color='text.primary'>
                            {item.routename}
                          </Typography>
                          <Typography variant='caption' color='text.disabled'>
                            {formatshortdate(item.Date)}
                          </Typography>
                        </div>
                        <Link
                          href={{
                            pathname: `/${locale}/work`,
                            query: `wid=${item.wid}`
                          }}
                        >
                          <Chip
                            className='mb-2 cursor-pointer hover:bg-primary hover:text-white'
                            label={item.wid}
                            size='small'
                            color='primary'
                            variant='tonal'
                            icon={<i className='tabler-grid-pattern' />}
                          />
                        </Link>
                        <Typography className='mbe-2'>
                          <span className='font-semibold'>Subject : </span>
                          {item.subject}
                        </Typography>
                        <Typography className='mbe-2'>
                          <span className='font-semibold'>Action : </span>
                          {item.detail}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  )
                }
              })}
            {!data && (
              <div className='flex flex-col items-center'>
                <Typography>Your activity not found!</Typography>
              </div>
            )}
          </Timeline>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader title='User Activity Timeline' />
        <CardContent>
          <Timeline>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='primary' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                  <Typography className='font-medium' color='text.primary'>
                    12 Invoices have been paid
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    12 min ago
                  </Typography>
                </div>
                <Typography className='mbe-2'>Invoices have been paid to the company</Typography>
                <div className='flex items-center gap-2.5 is-fit bg-actionHover rounded plb-[5px] pli-2.5'>
                  <img
                    height={20}
                    alt='invoice.pdf'
                    src={`${process.env.NEXT_PUBLIC_BASEPATH}/images/icons/pdf-document.png`}
                  />
                  <Typography className='font-medium'>invoices.pdf</Typography>
                </div>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='success' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                  <Typography className='font-medium' color='text.primary'>
                    Client Meeting
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    45 min ago
                  </Typography>
                </div>
                <Typography className='mbe-2'>Project meeting with john @10:15am</Typography>
                <div className='flex items-center gap-2.5'>
                  <CustomAvatar src={`${process.env.NEXT_PUBLIC_BASEPATH}/images/avatars/1.png`} size={32} />
                  <div className='flex flex-col flex-wrap'>
                    <Typography variant='body2' className='font-medium'>
                      Lester McCarthy (Client)
                    </Typography>
                    <Typography variant='body2'>CEO of Pixinvent</Typography>
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color='info' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                  <Typography className='font-medium' color='text.primary'>
                    Create a new project for client
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    2 Day Ago
                  </Typography>
                </div>
                <Typography className='mbe-2'>6 team members in a project</Typography>
                <AvatarGroup total={6} className='pull-up'>
                  <Avatar alt='Travis Howard' src={`${process.env.NEXT_PUBLIC_BASEPATH}/images/avatars/1.png`} />
                  <Avatar alt='Agnes Walker' src={`${process.env.NEXT_PUBLIC_BASEPATH}/images/avatars/4.png`} />
                  <Avatar alt='John Doe' src={`${process.env.NEXT_PUBLIC_BASEPATH}/images/avatars/2.png`} />
                </AvatarGroup>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card> */}
    </>
  )
}

export default UserActivityTimeLine
