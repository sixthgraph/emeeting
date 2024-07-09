'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import Image from 'next/image'

// MUI Imports
import Script from 'next/script'

// import $ from 'jquery'

import { useParams } from 'next/navigation'

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
import { Box, LinearProgress } from '@mui/material'

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

const WorkProfile = ({ workData }: { workData: any }) => {
  const params = useParams()
  const { lang: locale } = params
  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  console.log('workData in workProfileV2 ====')
  console.log(workData)

  // States
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const handleAccordionChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const expandIcon = (value: string) => <i className={expanded === value ? 'tabler-minus' : 'tabler-plus'} />

  const formatshortdate = (date: any) => {
    const m_th_names = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      ' เม.ย.',
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

    if (locale == 'th') {
      return curr_date + ' ' + m_th_names[curr_month] + ' ' + curr_year
    }

    return curr_date + ' ' + m_en_names[curr_month] + ' ' + curr_year
  }

  return (
    <>
      <TabContext value={value}>
        <Card variant='outlined'>
          {/* <CardMedia image={data?.coverImg} className='bs-[250px]' /> */}
          <CardContent className='flex gap-5 p-0 item-stretch flex-col'>
            <div className='flex p-5 items-stretch gap-4 w-full rounded-lg bg-stripes-cyan text-center'>
              <div className='rounded-bs-md item-start border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
                {/* <img height={55} width={55} src={data?.profileImg} className='rounded' alt='Profile Background' /> */}
                <Image
                  src={`/images/avatars/1.png`}
                  className='rounded'
                  alt='Profile Background'
                  height={55}
                  width={55}
                />
              </div>
              <div className='flex-1 flex flex-col items-start justify-start'>
                <Typography className='text-xs'>Created by:</Typography>
                <Typography className='font-bold'>
                  {workData?.usercreateinfo[0].firstname + ' ' + workData?.usercreateinfo[0].lastname}
                </Typography>
                <Typography className='text-xs mt-2'>Work ID:</Typography>
                <Typography className='font-bold'>{workData.wid}</Typography>
              </div>
              <div className='flex-1 flex flex-col items-start justify-start'>
                <Typography className='text-xs'>Created:</Typography>
                <Typography className='font-bold'>{formatshortdate(workData?.Registerdate)}</Typography>
                <Typography className='text-xs mt-2'>Subject:</Typography>
                <Typography className='font-bold'>{workData.subject}</Typography>
              </div>
              {/* <div className='flex-1 flex flex-col items-start justify-end'> */}
              <div className='flex-none w-59 flex flex-col'>
                <div className='flex flex-row'>
                  <Typography color='text.disabled' sx={{ paddingRight: 4 }}>
                    Work progress
                  </Typography>
                  <Typography className='font-bold'>50%</Typography>
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
                    <Tab
                      label={
                        <div className='flex items-center gap-1.5'>
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
              <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                <AccordionSummary
                  id='customized-panel-header-1'
                  expandIcon={expandIcon('panel1')}
                  aria-controls='customized-panel-content-1'
                >
                  <Typography>แบบคำขอรับการฝึกอบรมภายนอก</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className='fb-render'></div>
                  <Script
                    src='/script/test-render.js'
                    strategy='lazyOnload'
                    onReady={() => {
                      console.log('form render has loaded')

                      {
                        testScript()
                      }
                    }}
                  />
                </AccordionDetails>
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
            </TabPanel>
            <TabPanel value='2'>Documents list</TabPanel>
            <TabPanel value='3'>Activity content</TabPanel>
          </CardContent>
        </Card>
      </TabContext>
    </>
  )
}

export default WorkProfile
