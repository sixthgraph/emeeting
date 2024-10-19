'use client'
import { useEffect, useState } from 'react'

import { Chip, Divider, Drawer, IconButton, Typography } from '@mui/material'

import { useSession } from 'next-auth/react'

import axios from '@/utils/axios'

import WorkMessageV2 from '../workV2/WorkMessage_v2'

const CommentDrawer_v2 = ({ wid, open, handleClose }: { wid?: any; open: boolean; handleClose: () => void }) => {
  const { data: session } = useSession()
  const [commentdata, setCommentdata] = useState<any>()
  const [commentWorkData, setCommentWorkData] = useState<any>()
  const token = session?.user.token

  useEffect(() => {
    open && getData({ wid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const getData = async ({ wid }: { wid?: any }) => {
    console.log('getData start')

    try {
      const reqBody = {
        wid: wid,
        token: token
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/get-by-wid`, reqBody, { headers })
      const data = response.data

      setCommentdata(data[0])
      setCommentWorkData(data[0].workInfo)

      const dataObj = []

      for (const item of data) {
        //setMemberList(item.member)
        dataObj.push(item)
      }

      if (response.statusText === 'OK') {
        //setCommentList(dataObj) //return response.data
      } else {
        throw new Error('Failed to fetch Comment Data')
      }
    } catch (err: any) {
      console.log('--comment/get-by-wid response ---' + err)
    }
  }

  const handleReset = () => {
    handleClose()
    setCommentdata([])
    setCommentWorkData([])
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <div>
          <Typography variant='h5'>{`${commentWorkData?.subject}`}</Typography>
          <Chip
            className='mr-2'
            label={commentWorkData?.wid}
            size='small'
            color='secondary'
            variant='tonal'
            icon={<i className='tabler-grid-pattern' />}
          />
        </div>
        <IconButton onClick={handleClose}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />

      <WorkMessageV2 commentdetailData={commentdata} commentWorkData={commentWorkData} />
    </Drawer>
  )
}

export default CommentDrawer_v2
