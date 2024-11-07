'use client'

// MUI Imports
import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ProfileHeaderType } from '@/types/pages/profileTypes'

const UserProfileHeader = ({ workData, data }: { workData: any; data?: ProfileHeaderType }) => {
  return (
    <Card>
      {/* <CardMedia image={data?.coverImg} className='bs-[250px]' /> */}

      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row  md:justify-start'>
        {/* <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'> */}
        <div className='flex rounded-bs-md  border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <img height={55} width={55} src={data?.profileImg} className='rounded' alt='Profile Background' />
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <div className='grid grid-col-3 gap-6 '>
              <div>
                <Typography className='text-xs'>Created by:</Typography>
                <Typography className='font-bold'>{workData?.firstname + ' ' + workData?.lastname}</Typography>
                <Typography className='text-xs mt-2'>Work ID:</Typography>
                <Typography className='font-bold'>{workData.wid}</Typography>
              </div>
              <div>
                <Typography className='text-xs'>Created:</Typography>
                <Typography className='font-bold'>{workData?.Registerdate}</Typography>
                <Typography className='text-xs mt-2'>Subject:</Typography>
                <Typography className='font-bold'>{workData.subject}</Typography>
              </div>
              <div>
                <Typography className='font-medium'>Work progress 50%</Typography>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserProfileHeader
