'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Script from 'next/script'
import { useParams } from 'next/navigation'

import Link from 'next/link'

import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TabList from '@mui/lab/TabList'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import type { AccordionProps } from '@mui/material/Accordion'
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import type { AccordionDetailsProps } from '@mui/material/AccordionDetails'

import {
  Box,
  Button,
  CardActions,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress
} from '@mui/material'

import Timeline from '@mui/lab/Timeline'

import TimelineItem from '@mui/lab/TimelineItem'

import TimelineSeparator from '@mui/lab/TimelineSeparator'

import TimelineDot from '@mui/lab/TimelineDot'

import TimelineConnector from '@mui/lab/TimelineConnector'

import TimelineContent from '@mui/lab/TimelineContent'

import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'

import { useSession } from 'next-auth/react'

import { navigate } from './redirect'

// Type Imports

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import { formRenderV1, getEdata } from '@/utils/hooks/formRender'

// import { Formatshortdate } from '@/utils/hooks/datetime'
import axios from '@/utils/axios'

import DocumentListTable from '../workV2/DocumentListTable'

// Styled component for Accordion component
const Accordion = styled(MuiAccordion)<AccordionProps>({
  margin: '0 !important',
  borderRadius: 0,
  boxShadow: 'none !important',
  border: '1px solid var(--mui-palette-divider)',
  '&:not(:last-of-type)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  },
  '&:first-of-type': {
    '& .MuiButtonBase-root': {
      borderTopLeftRadius: 'var(--mui-shape-borderRadius)',
      borderTopRightRadius: 'var(--mui-shape-borderRadius)'
    }
  },
  '&:last-of-type': {
    '& .MuiAccordionSummary-root:not(.Mui-expanded)': {
      borderBottomLeftRadius: 'var(--mui-shape-borderRadius)',
      borderBottomRightRadius: 'var(--mui-shape-borderRadius)'
    }
  }
})

// Styled component for AccordionSummary component
const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
  borderBlockEnd: '0 !important',
  borderBlock: '0 !important',
  minHeight: theme.spacing(11.5),
  transition: 'min-height 0.15s ease-in-out',
  backgroundColor: 'var(--mui-palette-customColors-greyLightBg)',
  '&.Mui-expanded': {
    minHeight: theme.spacing(11.5),
    borderBlockEnd: '0px solid var(--mui-palette-divider) !important',
    '& .MuiAccordionSummary-expandIconWrapper': {
      transform: 'rotate(180deg)'
    }
  }
}))

// Styled component for AccordionDetails component
const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(({ theme }) => ({
  paddingBlockStart: `${theme.spacing(6)} !important`
}))

const WorkProfile = ({ workData, condionData }: { workData?: any; condionData?: any }) => {
  const [open, setOpen] = useState<boolean>(false)

  console.log('workData ===')
  console.log(workData)
  const eformData = workData?.eformdata
  let i: any
  const eform: any = eformData

  console.log('condionData -----')
  console.log(condionData)

  for (i in eform) {
    eformData[i]._id = eform[i].Id
  }

  const { data: session } = useSession()

  const documentData = {
    wid: workData?.wid,
    email: session?.user.email,
    dep: workData?.curdep,
    rid: workData?.workflowid,
    pid: workData?.blockid,
    attachment: workData?.attachment
  }

  const [value, setValue] = useState('1')
  const [dialogTitle, setDialogTitle] = useState('Title')
  const [dialogMsg, setDialogMsg] = useState('Msg')
  const [expanded, setExpanded] = useState<string | false>('panel-' + eformData[0].Id)
  const params = useParams()
  const { lang: locale } = params
  const basepath = process.env.NEXT_PUBLIC_BASEPATH

  const activity = workData.activity

  // const attactmentData = workData.attachment
  // console.log(attactmentData)

  // const searchParams = useSearchParams()

  // const workflowid = searchParams.get('workflowid')
  // const blockid = searchParams.get('blockid')
  // const dep = searchParams.get('dep')

  // const paramsData = {
  //   workflowid: workflowid,
  //   blockid: blockid,
  //   dep: dep
  // }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleOpenDialog = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  // States

  const handleAccordionChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleEditwork = async () => {
    const eformData = await getEdata(workData.eformdata)

    workData.eformdata = eformData

    //workData.workflowid = workflowid

    // workData.blockId = blockid

    const reqBody = workData

    // delete reqBody.usercreateinfo
    // delete reqBody.workinprocess

    // delete reqBody.curdep
    // delete reqBody.curuid

    console.log('(edit worj reqBody) reqbody ===')
    console.log(reqBody)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/edit`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call Editwork success.------------------')
      } else {
        console.log(response.data.message)
      }
    } catch (error: any) {
      console.log('Editwork failed. ', error.message)
    }
  }

  const handleNotificateion = async () => {
    console.log('start handleNotificateion')
  }

  const handleDecision = async () => {
    console.log('start handleDecision')
  }

  const handleTask = async () => {
    console.log('start handleTask')
  }

  const handleEditAndSendWork = async () => {
    handleEditwork().then(() => {
      handleTask().then(() => {
        handleDecision().then(() => {
          handlesendwork().then(() => {
            handleNotificateion()
          })
        })
      })
    })
  }

  console.log('---condionData')
  console.log(condionData)

  const handlesendwork = async () => {
    if (condionData.length > 1) {
      setDialogTitle('Title 1')
      setDialogMsg('Msg 1')

      handleOpenDialog()

      return
    }

    if (condionData.length == 0 || !condionData) {
      setDialogTitle('Title 2')
      setDialogMsg('Msg 2')
      handleOpenDialog()

      return
    }

    try {
      const reqBody = {
        wid: workData.wid,
        uid: condionData[0].userid,
        dep: condionData[0].basketId[0],
        rid: workData.workflowid,
        pid: condionData[0].blockId,
        dateexp: workData.Expiredate,
        senderdep: workData.curdep,
        senderpid: workData.blockid,
        senderuid: workData.curuid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/send`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call sendwork success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `/en/todo`

      navigate(path)
    } catch (error: any) {
      console.log('sendwork failed. ', error.message)
    }
  }

  const handlesendbackwork = async () => {
    try {
      const reqBody = {
        wid: workData.wid,
        uid: workData.curuid,
        dep: workData.curdep,
        pid: workData.blockid,
        rid: workData.workflowid,
        senderpid: workData.senderpid,
        senderuid: workData.senderuid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/sendback`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call sendbackwork success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `/en/todo`

      navigate(path)
    } catch (error: any) {
      console.log('sendbackwork failed. ', error.message)
    }
  }

  const handlerejectwork = async () => {
    try {
      const reqBody = {
        wid: workData.wid,
        rid: workData.workflowid,
        blockid: workData.blockid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/reject`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call reject success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `/en/todo`

      navigate(path)
    } catch (error: any) {
      console.log('reject failed. ', error.message)
    }
  }

  const handleEndWork = async () => {
    try {
      const reqBody = {
        wid: workData.wid,
        rid: workData.workflowid,
        blockid: workData.blockid
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/end`, reqBody)

      if (response.data.message === 'success') {
        console.log('---Call end success.------------------')
      } else {
        console.log(response.data.message)
      }

      const path = `/en/todo`

      navigate(path)
    } catch (error: any) {
      console.log('reject failed. ', error.message)
    }
  }

  const expandIcon = (value: string) => <i className={expanded === value ? 'tabler-minus' : 'tabler-plus'} />

  const getAvatar = (params: Pick<any, 'avatar' | 'fullName'>) => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} size={55} variant='rounded' />
    } else {
      return (
        <CustomAvatar size={55} variant='rounded'>
          {getInitials(fullName as string)}
        </CustomAvatar>
      )
    }
  }

  //handleEndWork

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
    <>
      <TabContext value={value}>
        <Card variant='outlined'>
          <CardContent className='flex p-4 pb-0 gap-2 item-stretch flex-col'>
            <Grid className='flex flex-col gap-0'>
              <Grid className=' flex lg:flex-row sm:flex-col md:flex-col gap-4'>
                <Grid className='md:flex-1 flex gap-4'>
                  <div className='flex rounded-bs-md item-start border-backgroundPaper bg-backgroundPaper'>
                    {workData &&
                      workData?.usercreateinfo[0] &&
                      getAvatar({
                        avatar: workData?.usercreateinfo[0].avatar,
                        fullName: workData?.usercreateinfo[0].firstname + ' ' + workData?.usercreateinfo[0].lastname
                      })}
                  </div>
                  <div className='flex flex-1 flex flex-col items-start justify-start'>
                    <Typography className='text-xs'>Request by:</Typography>
                    <Typography className='font-semibold text-slate-900'>
                      {workData?.usercreateinfo[0].firstname + ' ' + workData?.usercreateinfo[0].lastname}
                    </Typography>
                    <Chip
                      color='primary'
                      variant='tonal'
                      label={`${activity[0].actions[0].depname} / ${activity[0].actions[0].positionname}`}
                      size='small'
                    />
                    <Typography className='text-xs mt-2'>Work ID:</Typography>
                    <Typography className='font-semibold text-slate-900'>{workData.wid}</Typography>
                  </div>
                </Grid>
                <Grid className='md:flex-1 '>
                  {/* <div className='border-solid border-2 border-amber-400'> */}
                  <Typography className='text-xs'>Create Date:</Typography>
                  <Typography className='font-semibold text-slate-900'>
                    {formatshortdate(workData?.Registerdate)}
                  </Typography>
                  <Typography className='text-xs mt-8'>Recieved Date :</Typography>
                  <Typography className='font-semibold text-slate-900 text-left'>
                    {formatshortdate(workData.datein)}
                  </Typography>
                  {/* </div> */}
                </Grid>
                <Grid className=' w-59 '>
                  <div className='flex-none w-59 flex flex-col'>
                    <div className='flex flex-row'>
                      <Typography color='text.disabled' sx={{ paddingRight: 4 }}>
                        Work progress
                      </Typography>
                      <Typography className='font-semibold text-slate-900'>50%</Typography>
                    </div>
                    <LinearProgress value={50} variant='determinate' color='success' className='mt-2 mr-2 min-bs-1' />
                  </div>
                </Grid>
              </Grid>
              <Grid className='flex gap-4 '>
                <div className='flex-none w-14'></div>
                <div className='flex-1'>
                  <Typography className='text-xs mt-2'>Subject :</Typography>
                  <Typography className='flex-1 font-semibold text-slate-900 text-left'>{workData.subject}</Typography>
                </div>
              </Grid>
            </Grid>

            <Grid className='flex flex-1'>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <Box>
                  <TabList onChange={handleChange} aria-label='lab API tabs example'>
                    <Tab
                      label={
                        <div id='eform-tab' className='flex items-center gap-1.5 font-semibold '>
                          <i className='tabler-article text-lg' />
                          Forms
                        </div>
                      }
                      value='1'
                    />
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5 font-semibold'>
                          <i className='tabler-paperclip text-lg' />
                          Documents
                        </div>
                      }
                      value='2'
                    />
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5 font-semibold'>
                          <i className='tabler-chart-bar text-lg' />
                          Activity
                        </div>
                      }
                      value='3'
                    />
                  </TabList>
                </Box>
              </Box>
            </Grid>
          </CardContent>
        </Card>
        <Card variant='outlined'>
          <CardContent className='gap-6 p-0'>
            <TabPanel value='1'>
              {eformData.map((form: any) => {
                return (
                  <Accordion
                    key={form._id}
                    expanded={expanded === `panel-${form.Id}`}
                    onChange={handleAccordionChange(`panel-${form.Id}`)}
                  >
                    <AccordionSummary
                      id={`customized-panel-header-${form.Id}`}
                      expandIcon={expandIcon('panel1')}
                      aria-controls='customized-panel-content-1'
                    >
                      <Typography className='text-slate-900'>{form.form_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div id={`fb-render-${form.Id}`}>Loading...</div>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
              <Script
                src={`${basepath}/script/test-render.js`}
                strategy='lazyOnload'
                onReady={() => {
                  console.log('form render has loaded')
                  formRenderV1(eformData)
                }}
              />
            </TabPanel>
            <TabPanel value='2'>
              <DocumentListTable docData={documentData} />
            </TabPanel>
            <TabPanel value='3'>
              <Card>
                <CardHeader title='Work Activity Timeline' />
                <CardContent>
                  <Timeline position='alternate'>
                    {activity.map((item: any, index: any) => {
                      return (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent>
                            <Typography variant='caption' component='div' className='mbs-0'>
                              {formatshortdate(item.actions[0].Date)}
                            </Typography>
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Card>
                              <CardContent>
                                <Typography variant='h5' className='mbe-4 text-left'>
                                  {/* {item.blockId} */}
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
                                          {formatshortdate(act.Date)}
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
                </CardContent>
              </Card>
            </TabPanel>
          </CardContent>
        </Card>
      </TabContext>
      <footer
        className='w-full content-center'
        style={{ color: 'gray', position: 'fixed', bottom: 0, left: 0, textAlign: 'center' }}
      >
        <Card>
          <CardActions
            disableSpacing
            sx={{
              alignSelf: 'stretch',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              p: 2
            }}
          >
            {workData.blockid !== 'startpoint' &&
              condionData[0] !== 'end-process' &&
              condionData[0] !== 'null' &&
              workData.action == '' && (
                <Button variant='contained' onClick={() => handlesendbackwork()} className='mr-2' type='submit'>
                  Send Back
                </Button>
              )}

            {condionData[0] !== 'null' && condionData[0] !== 'end-process' && workData.action == '' && (
              <>
                <Button
                  variant='contained'
                  onClick={() => handleEditwork()}
                  className='mr-2'
                  color='info'
                  type='submit'
                >
                  Save
                </Button>

                {/* <Button variant='contained' onClick={() => handleEditAndSendWork()} className='mr-2' type='submit'>
                  Finish
                </Button> */}
              </>
            )}

            {condionData[0] !== 'end-process' &&
              condionData[0] !== 'null' &&
              workData.action == '' &&
              workData.blockid !== 'startpoint' && (
                <Button
                  variant='contained'
                  color='info'
                  onClick={() => handlerejectwork()}
                  className='mr-2'
                  type='submit'
                >
                  Reject
                </Button>
              )}

            {condionData[0] !== 'end-process' &&
              condionData[0] !== 'null' &&
              workData.action == '' &&
              workData.blockid !== 'startpoint' && (
                <Button variant='contained' onClick={() => handleEditAndSendWork()} className='mr-2' type='submit'>
                  Approve
                </Button>
              )}

            {condionData[0] !== 'end-process' &&
              condionData[0] !== 'null' &&
              workData.action == '' &&
              workData.blockid == 'startpoint' && (
                <Button variant='contained' onClick={() => handleEditAndSendWork()} className='mr-2' type='submit'>
                  Send
                </Button>
              )}

            {condionData[0] === 'end-process' && workData.action == '' && (
              <>
                <Button variant='contained' onClick={() => handlesendbackwork()} className='mr-2' type='submit'>
                  Send Back
                </Button>

                <Button
                  variant='contained'
                  color='info'
                  onClick={() => handlerejectwork()}
                  className='mr-2'
                  type='submit'
                >
                  Reject
                </Button>

                <Button variant='contained' onClick={() => handleEndWork()} className='mr-2' type='submit'>
                  End Finish
                </Button>
              </>
            )}

            {/* {condionData === 'end-process' && workData.action == '' && (

            )} */}

            <Link href={'/en/todo'}>
              <Button variant='contained' color='inherit'>
                close
              </Button>
            </Link>
          </CardActions>
        </Card>
      </footer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
      {/* <WorkButton workData={workData} paramsData={paramsData} /> */}
    </>
  )
}

export default WorkProfile
