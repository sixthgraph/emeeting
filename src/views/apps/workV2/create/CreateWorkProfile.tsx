'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// MUI Imports
import Script from 'next/script'

// import $ from 'jquery'

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

import { Formatshortdate } from '@/utils/hooks/datetime'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

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
  const [value, setValue] = useState('1')

  const { data: session } = useSession({
    required: true
  })

  const today = new Date()
  const userData: any = session?.user

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  // States
  const [expanded, setExpanded] = useState<string | false>('panel-' + workData[0]._id)

  const handleAccordionChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
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

  // Vars

  return (
    <>
      <TabContext value={value}>
        <Card variant='outlined'>
          {/* <CardMedia image={data?.coverImg} className='bs-[250px]' /> */}
          <CardContent className='flex gap-5 p-0 item-stretch flex-col'>
            <div className='flex p-5 items-stretch gap-4 w-full rounded-lg bg-stripes-cyan text-center'>
              <div className='rounded-bs-md item-start border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
                {userData && getAvatar({ avatar: session?.user.avatar, fullName: session?.user.name })}
              </div>
              <div className='flex-1 flex flex-col items-start'>
                <Typography className='text-xs flex'>Created by:</Typography>
                <Typography className='font-bold flex pb-4'>{session?.user ? session.user.name : '--'}</Typography>
                <FormControl variant='standard' fullWidth>
                  <InputLabel id='department-select-label'>Select department</InputLabel>
                  <Select
                    label='Select department'
                    labelId='department-select-label'
                    id='department-select'
                    defaultValue=''
                    className='text-left'
                  >
                    {userData &&
                      userData.dep.map((dep: any) => {
                        return (
                          <MenuItem key={dep.depid} value={dep.depid}>
                            {dep.depname} / {dep.positionname}
                          </MenuItem>
                        )
                      })}
                  </Select>
                </FormControl>
              </div>
              <div className='flex-1 flex flex-col items-start justify-start'>
                <Typography className='text-xs'>Create date:</Typography>
                <Typography className='font-bold pb-4'>{Formatshortdate(today)}</Typography>
                <TextField fullWidth id='subject' label='Subject' variant='standard' />
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
              <div className='fb-render'></div>
              <Script
                src='/script/test-render.js'
                strategy='lazyOnload'
                onReady={() => {
                  console.log('form render has loaded')

                  {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    renderEform()
                  }
                }}
              />
              {/*
              <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                <AccordionSummary
                  id='customized-panel-header-1'
                  expandIcon={expandIcon('panel1')}
                  aria-controls='customized-panel-content-1'
                >
                  <Typography>แบบคำขอรับการฝึกอบรมภายนอก</Typography>
                </AccordionSummary>
                <AccordionDetails>1111</AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
                <AccordionSummary
                  id='customized-panel-header-2'
                  expandIcon={expandIcon('panel2')}
                  aria-controls='customized-panel-content-2'
                >
                  <Typography>Eform 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Sugar plum sesame snaps caramels. Cake pie tart fruitcake sesame snaps donut cupcake macaroon.
                    Gingerbread pudding cheesecake pie ice cream.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
                <AccordionSummary
                  id='customized-panel-header-3'
                  expandIcon={expandIcon('panel3')}
                  aria-controls='customized-panel-content-3'
                >
                  <Typography>Eform 3</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Gingerbread lemon drops bear claw gummi bears bonbon wafer jujubes tiramisu. Jelly pie cake. Sweet
                    roll dessert sweet pastry powder.
                  </Typography>
                </AccordionDetails>
              </Accordion>
             */}
            </TabPanel>
            <TabPanel value='2'>Documents list</TabPanel>
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
            <Button variant='text'>Create</Button>
          </CardActions>
        </Card>
      </footer>
    </>
  )
}

export default CreateWorkProfile
