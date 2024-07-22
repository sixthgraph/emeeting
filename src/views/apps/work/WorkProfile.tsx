'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Script from 'next/script'
import { redirect, useParams, useSearchParams } from 'next/navigation'

import Link from 'next/link'

import { useSession } from 'next-auth/react'

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

import { Box, Button, CardActions, CardHeader, LinearProgress } from '@mui/material'

import { navigate } from './redirect'

// Type Imports

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import { formRenderV1, getEdata } from '@/utils/hooks/formRender'

// import { Formatshortdate } from '@/utils/hooks/datetime'
import axios from '@/utils/axios'

import WorkButton from './WorkButton'
import FileUploaderMultiple from './FileUploaderMultiple'
import DocumentListTable from '../workV2/DocumentListTable'
import typography from '../../../components/themeV2/overrides/typography'

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

const WorkProfile = ({ workData, condionData }: { workData: any; condionData: any }) => {
  const params = useParams()
  const { lang: locale } = params

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/en/users/profile')
    }
  })

  const activity = workData.activity
  const action = []
  let j: any
  const elem: any = activity

  console.log('---activity---')
  console.log(activity)

  for (j in elem) {
    const newData = { blockId: elem[j].blockId, acitons: elem[j].actions }

    action.push(newData)

    //action = elem[j].actions
  }

  console.log('----action---')
  console.log(action)

  console.log('----workData---')
  console.log(workData)
  console.log('----condionData---')
  console.log(condionData)

  const searchParams = useSearchParams()
  const workflowid = searchParams.get('workflowid')
  const blockid = searchParams.get('blockid')
  const dep = searchParams.get('dep')
  const [value, setValue] = useState('1')

  // const paramsData = {
  //   workflowid: workflowid,
  //   blockid: blockid,
  //   dep: dep
  // }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const eformData = workData.eformdata
  let i: any
  const eform: any = eformData

  for (i in eform) {
    eformData[i]._id = eform[i].Id
  }

  // States
  const [expanded, setExpanded] = useState<string | false>('panel-' + eformData[0].Id)

  const handleAccordionChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleEditwork = async () => {
    const eformData = await getEdata(workData.eformdata)

    workData.eformdata = eformData

    //workData.workflowid = workflowid

    // workData.blockId = blockid

    const reqBody = workData

    delete reqBody.usercreateinfo
    delete reqBody.workinprocess

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

  const handleEditAndSendWork = async () => {
    handleEditwork().then(() => {
      handlesendwork()
    })
  }

  const handlesendwork = async () => {
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

  const handlesendbackwork = async (formData: any) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/send`, formData)

      if (response.data.message === 'success') {
        console.log('---Call sendbackwork success.------------------')
      } else {
        console.log(response.data.message)
      }
    } catch (error: any) {
      console.log('Editwork failed. ', error.message)
    }
  }

  const handlerejectwork = async (formData: any) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/rejet`, formData)

      if (response.data.message === 'success') {
        console.log('---Call rejectwork success.------------------')
      } else {
        console.log(response.data.message)
      }
    } catch (error: any) {
      console.log('Editwork failed. ', error.message)
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
          {/* <CardMedia image={data?.coverImg} className='bs-[250px]' /> */}
          <CardContent className='flex gap-5 p-0 item-stretch flex-col'>
            <div className='flex p-5 items-stretch gap-4 w-full rounded-lg bg-stripes-cyan text-center'>
              <div className='rounded-bs-md item-start border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
                {workData &&
                  getAvatar({
                    avatar: workData?.usercreateinfo[0].avatar,
                    fullName: workData?.usercreateinfo[0].firstname + ' ' + workData?.usercreateinfo[0].lastname
                  })}

                {/* workData?.usercreateinfo[0].firstname */}
              </div>
              <div className='flex-1 flex flex-col items-start justify-start'>
                <Typography className='text-xs'>Request by:</Typography>
                <Typography className='font-semibold text-slate-900'>
                  {workData?.usercreateinfo[0].firstname + ' ' + workData?.usercreateinfo[0].lastname}
                </Typography>
                <Typography className='text-xs mt-2'>Work ID:</Typography>
                <Typography className='font-semibold text-slate-900'>{workData.wid}</Typography>
              </div>
              <div className='flex-1 flex flex-col items-start justify-start'>
                <Typography className='text-xs'>Create Date:</Typography>
                <Typography className='font-semibold text-slate-900'>
                  {formatshortdate(workData?.Registerdate)}
                </Typography>
                <Typography className='text-xs mt-2'>Subject:</Typography>
                <Typography className='font-semibold text-slate-900 text-left'>{workData.subject}</Typography>
              </div>
              {/* <div className='flex-1 flex flex-col items-start justify-end'> */}
              <div className='flex-none w-59 flex flex-col'>
                <div className='flex flex-row'>
                  <Typography color='text.disabled' sx={{ paddingRight: 4 }}>
                    Work progress
                  </Typography>
                  <Typography className='font-semibold text-slate-900'>50%</Typography>
                </div>
                <LinearProgress value={50} variant='determinate' color='success' className='mt-2 mr-2 min-bs-1' />
              </div>
            </div>
            <div className='flex flex-1'>
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
            </div>
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
                src='/script/test-render.js'
                strategy='lazyOnload'
                onReady={() => {
                  console.log('form render has loaded')
                  formRenderV1(eformData)
                }}
              />
            </TabPanel>
            <TabPanel value='2'>
              <DocumentListTable />
            </TabPanel>
            <TabPanel value='3'>
              {/* {activityBlockName} */}

              {activity.map((item: any, index: any) => {
                return (
                  <div key={index}>
                    <h3>{item.blockId}</h3>
                    {item.actions.map((act: any, ind: any) => {
                      return (
                        <div key={ind}>
                          <Typography>{act.user}</Typography>
                          <Typography>{formatshortdate(act.Date)}</Typography>
                          <Typography>{act.detail}</Typography>
                          <Typography>-----</Typography>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
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
            {condionData && (
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

                <Button variant='contained' onClick={() => handleEditAndSendWork()} className='mr-2' type='submit'>
                  Finish
                </Button>
              </>
            )}

            <Link href={'/en/todo'}>
              <Button variant='contained' color='inherit'>
                close
              </Button>
            </Link>
          </CardActions>
        </Card>
      </footer>

      {/* <WorkButton workData={workData} paramsData={paramsData} /> */}
    </>
  )
}

export default WorkProfile
