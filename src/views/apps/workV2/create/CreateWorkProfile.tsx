'use client'

import { useDeferredValue, useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Script from 'next/script'

// import $ from 'jquery'
import { useSearchParams } from 'next/navigation'

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

// Type Imports
import { Box, Button, CardActions, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useSession } from 'next-auth/react'

import { navigate } from './redirect'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import { formRenderV1, getEdata } from '@/utils/hooks/formRender'
import axios from '@/utils/axios'
import CreateDocumentTable from './CreateDocumentTable'

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

const CreateWorkProfile = ({ workData }: { workData: any }) => {
  console.log('CreateWorkProfile----')
  console.log(workData)

  const initialData = {
    Registerdep: '',
    Subject: ''
  }

  // States
  const [value, setValue] = useState('1')
  const [expanded, setExpanded] = useState<string | false>('panel-' + workData[0]._id)
  const [formData, setFormData] = useState(...[initialData])
  const searchParams = useSearchParams()
  const routename = searchParams.get('routename')
  const routeId = searchParams.get('rid')

  const { data: session } = useSession({
    required: true
  })

  const userData: any = session?.user
  const eformData = []

  const userDefaultDep: string = userData?.dep[0].depid

  for (let i = 0; i < workData.length; i++) {
    const newData = {
      id: workData[i]._id,
      form_template: workData[i].form_template
    }

    eformData.push(newData)
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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleAccordionChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleSubmit = async () => {
    const eformData = await getEdata(workData)
    const date: Date = new Date()
    const EformData = []

    let i: any
    const n: any = eformData

    for (i in n) {
      const newData = {
        // Eform_id: n[i]._id,
        // Eform_tmp: n[i].form_template

        Form_id: n[i]._id,
        Form_template: n[i].form_template
      }

      EformData.push(newData)
    }

    const data = {
      Registerdate: date,
      Registerdep: formData.Registerdep,
      Registeruid: session?.user.email,
      Subject: formData.Subject,
      Status: 'workflow',
      EformData: EformData,
      WorkflowId: routeId,
      Blockid: 'startpoint'
    }

    console.log('reqBody - data ===')
    console.log(data)

    try {
      const response = await axios.post('/api/work/create', data)

      if (response.data.message === 'success') {
        console.log('Create work success.')

        const wid = response.data.data
        const path = `/en/work?wid=${wid}&wip=&dep=${formData.Registerdep}&routename=${routename}&workflowid=${routeId}`

        navigate(path)
      }
    } catch (error: any) {
      console.log('Create work failed. ', error.message)
    }
  }

  const basepath = process.env.NEXT_PUBLIC_BASEPATH

  return (
    <>
      <TabContext value={value}>
        <Card variant='outlined'>
          <CardContent className='flex gap-5 p-0 item-stretch flex-col'>
            <div className='flex p-5 items-stretch gap-4 w-full rounded-lg bg-stripes-cyan text-center'>
              <div className='rounded-bs-md item-start border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
                {userData && getAvatar({ avatar: session?.user.avatar, fullName: session?.user.name })}
              </div>
              <div className='flex-1 flex flex-col items-start'>
                <Typography className='text-xs flex'>Created by:</Typography>
                <Typography className='font-bold flex pb-4'>{session?.user ? session.user.name : '--'}</Typography>
                <FormControl variant='standard' fullWidth>
                  <InputLabel id='department-select-label'>Select department </InputLabel>
                  <Select
                    label='Select department'
                    labelId='department-select-label'
                    id='department-select'
                    defaultValue={userDefaultDep.toString()}
                    className='text-left' // onChange={e => (initialData.Registerdep = e.target.value)}
                    onChange={e => setFormData({ ...formData, Registerdep: e.target.value })}
                  >
                    {userData &&
                      userData.dep.map((dep: any, index: any) => {
                        return (
                          <MenuItem key={index} value={dep.depid}>
                            {dep.depname} / {dep.positionname}
                          </MenuItem>
                        )
                      })}
                  </Select>
                </FormControl>
              </div>
              <div className='flex-1 flex flex-col items-start justify-start'>
                <Typography className='text-xs'>Route name:</Typography>
                <Typography className='font-bold pb-4'>{routename}</Typography>
                <TextField
                  fullWidth
                  id='subject'
                  label='Subject'
                  variant='standard' // onChange={e => (initialData.Subject = e.target.value)}
                  onChange={e => setFormData({ ...formData, Subject: e.target.value })}
                />
              </div>
            </div>
            <div className='flex flex-1'>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <Box>
                  <TabList onChange={handleChange} aria-label='lab API tabs example'>
                    <Tab
                      label={
                        <div id='eform-tab' className='flex items-center gap-1.5'>
                          <i className='tabler-article text-lg' />
                          E-Forms
                        </div>
                      }
                      value='1'
                    />
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5'>
                          <i className='tabler-paperclip text-lg' />
                          Documents
                        </div>
                      }
                      value='2'
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
              {workData.map((form: any) => {
                return (
                  <Accordion
                    key={form._id}
                    expanded={expanded === `panel-${form._id}`}
                    onChange={handleAccordionChange(`panel-${form._id}`)}
                  >
                    <AccordionSummary
                      id={`customized-panel-header-${form._id}`}
                      expandIcon={expandIcon('panel1')}
                      aria-controls='customized-panel-content-1'
                    >
                      <Typography>{form.form_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div id={`fb-render-${form._id}`}>{`fb-render-${form._id}`}</div>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
              <Script
                src={`${basepath}/script/test-render.js`}
                strategy='lazyOnload'
                onReady={() => {
                  console.log('form render has loaded')

                  formRenderV1(workData)
                }}
              />
            </TabPanel>
            <TabPanel value='2'>
              <CreateDocumentTable />
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
            <Button variant='contained' color='primary' onClick={() => handleSubmit()}>
              Create
            </Button>
          </CardActions>
        </Card>
      </footer>
    </>
  )
}

export default CreateWorkProfile
