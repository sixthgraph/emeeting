'use client'

// MUI Imports
import { useParams } from 'next/navigation'
import Link from 'next/link'

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
import { Card, Chip } from '@mui/material'

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

const UserActivityTimeLineV2 = ({ data }: { data?: any }) => {
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

    if (locale == 'th') {
      return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year + ' ' + curr_time
    }

    return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year + ' ' + curr_time
  }

  return (
    <Card>
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
  )
}

export default UserActivityTimeLineV2
