import Link from 'next/link'

import { Button, Card, CardActions } from '@mui/material'

import { getEdata } from '@/utils/hooks/formRender'
import axios from '@/utils/axios'

const handleEditwork = async (workData: any, workflowid: any, blockid: any) => {
  const eformData = await getEdata(workData.eformdata)

  // workData.eformdata = eformData
  workData.eformdata = eformData

  delete workData.usercreateinfo
  delete workData.workinprocess

  workData.workflowid = workflowid
  workData.blockId = blockid

  console.log('(workData) reqbody ===')
  console.log(workData)

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/edit`, workData)

    if (response.data.message === 'success') {
      console.log('---Call Editwork success.------------------')
    } else {
      console.log(response.data.message)
    }
  } catch (error: any) {
    console.log('Editwork failed. ', error.message)
  }
}

const WorkButton = async ({ workData, paramsData }: { workData: any; paramsData: any }) => {
  console.log('footer work data===')
  console.log(workData)
  console.log('paramsData')
  console.log(paramsData)

  const workflowid = paramsData.workflowid
  const blockid = paramsData.blockid

  return (
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
          <Button
            variant='contained'
            onClick={() => handleEditwork(workData, workflowid, blockid)}
            className='mr-2'
            color='info'
            type='submit'
          >
            Save
          </Button>

          <Button variant='contained' onClick={() => handlesendwork(formData)} className='mr-2' type='submit'>
            Finish
          </Button>
          <Link href={'/en/todo'}>
            <Button variant='contained' color='inherit'>
              close
            </Button>
          </Link>
        </CardActions>
      </Card>
    </footer>
  )
}

export default WorkButton
