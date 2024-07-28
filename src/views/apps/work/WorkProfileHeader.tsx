'use client'

import Image from 'next/image'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ProfileHeaderType } from '@/types/pages/profileTypes'

const WorkProfileHeader = ({ workData }: { workData: any; data?: ProfileHeaderType }) => {
  return (
    <Card variant='outlined'>
      {/* <CardMedia image={data?.coverImg} className='bs-[250px]' /> */}
      <CardContent className='flex gap-5 p-0 item-stretch flex-col'>
        <div className='flex p-5 items-stretch gap-4 w-full rounded-lg bg-stripes-cyan text-center'>
          <div className='rounded-bs-md item-start border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
            {/* <img height={55} width={55} src={data?.profileImg} className='rounded' alt='Profile Background' /> */}
            <Image
              src={`${process.env.NEXT_PUBLIC_BASEPATH}/images/avatars/1.png`}
              className='rounded'
              alt='Profile Background'
              height={55}
              width={55}
            />
          </div>
          <div className='flex-1 flex flex-col items-start justify-start'>
            <Typography className='text-xs'>Created by:</Typography>
            <Typography className='font-bold'>{workData?.firstname + ' ' + workData?.lastname}</Typography>
            <Typography className='text-xs mt-2'>Work ID:</Typography>
            <Typography className='font-bold'>{workData.wid}</Typography>
          </div>
          <div className='flex-1 flex flex-col items-start justify-start'>
            <Typography className='text-xs'>Created:</Typography>
            <Typography className='font-bold'>{workData?.Registerdate}</Typography>
            <Typography className='text-xs mt-2'>Subject:</Typography>
            <Typography className='font-bold'>{workData.subject}</Typography>
          </div>
          <div className='flex-1 flex items-start justify-end'>
            <Typography className='font-medium'>Work progress 50%</Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkProfileHeader
