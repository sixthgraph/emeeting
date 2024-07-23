// MUI Imports

import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Card, CardContent } from '@mui/material'
import Timeline from '@mui/lab/Timeline'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'

import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'

import TimelineContent from '@mui/lab/TimelineContent'

import CustomAvatar from '@/@core/components/mui/Avatar'

type Props = {
  open?: boolean
  trackingData?: any
  workInfo?: any
  handleClose: () => void
}

const TrackingDrawerInfo = ({ open, trackingData, workInfo, handleClose }: Props) => {
  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <div>
          <Typography variant='h5'>{workInfo.subject}</Typography>
          <Typography variant='body2'>Work ID : {workInfo.wid}</Typography>
        </div>
        <IconButton onClick={handleClose}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      {/* <Divider /> */}
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0
          }
        }}
        position='right'
      >
        {trackingData.map((item: any, index: any) => {
          return (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color='primary' />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Card>
                  <CardContent>
                    <Typography variant='h5' className='mbe-4 text-left'>
                      {item.actions[0].processname}
                    </Typography>

                    {item.actions.map((act: any, ind: any) => {
                      let curUser = ''

                      if (ind !== 0) {
                        curUser = act.user
                      }

                      return (
                        <div key={ind} className='flex gap-5 flex-col'>
                          {curUser !== act.user && (
                            <div className='flex items-center gap-2.5'>
                              <CustomAvatar src={act.avatar} size={32} />
                              <div className='flex flex-col flex-wrap '>
                                <Typography variant='body2' className='font-medium'>
                                  {act.name}
                                </Typography>
                                <Typography variant='body2' className='text-left'>
                                  {act.depname} / {act.positionname}
                                </Typography>
                              </div>
                            </div>
                          )}

                          <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                            <Typography className='font-medium' color='text.primary'>
                              {act.detail}
                            </Typography>
                            <Typography variant='caption' color='text.disabled'>
                              {act.Date}
                            </Typography>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Drawer>
  )
}

export default TrackingDrawerInfo
