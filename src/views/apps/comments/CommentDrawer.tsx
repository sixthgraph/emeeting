'use client'
import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { Card, CardContent, Chip, Divider, Drawer, IconButton, Typography } from '@mui/material'

import { useSession } from 'next-auth/react'

import axios from '@/utils/axios'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

const getAvatar = (params: Pick<any, 'avatar' | 'fullName'>) => {
  const { avatar, fullName } = params

  if (avatar) {
    return <CustomAvatar src={avatar} size={45} variant='rounded' />
  } else {
    return (
      <CustomAvatar size={45} variant='rounded'>
        {getInitials(fullName as string)}
      </CustomAvatar>
    )
  }
}

const CommentDrawer = ({ wid, open, handleClose }: { wid?: any; open: boolean; handleClose: () => void }) => {
  const { data: session } = useSession()
  const token = session?.user.token
  const [commentList, setCommentList] = useState<any>([])
  const [memberList, setMemberList] = useState<any>([])

  //const wid = '66d98dd42df10ec61a3b3d24'

  const params = useParams()
  const { lang: locale } = params

  console.log('memberList')
  console.log(memberList)

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
      const dataObj = []

      for (const item of data) {
        console.log(item.comment)
        console.log(item.member)
        setCommentList(item.comment)
        setMemberList(item.member)
        console.log('-----')
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

  useEffect(() => {
    open && getData({ wid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  console.log('commentList')
  console.log(commentList)

  const handleReset = () => {
    handleClose() //setFormData(initialData)
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
          <Typography variant='h5'>{`workInfo.subject`}</Typography>
          <Typography variant='body2'>Work ID : {`workInfo.wid`}</Typography>
        </div>
        <IconButton onClick={handleClose}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <Card variant='outlined'>
        <CardContent className='pb-0' style={{ maxHeight: '560px', overflow: 'auto' }}>
          {/* <CardContent className='pb-0' style={{ maxHeight: '100%', overflow: 'auto' }}> */}
          {commentList &&
            commentList.map((item: any, index: any) => {
              return (
                <div key={index}>
                  {/* // start user profile */}
                  <div className='flex flex-col mb-3'>
                    <div className='flex flex-row '>
                      <div className='flex  me-5'>
                        {getAvatar({
                          avatar: `${item.avatar}`,
                          fullName: `${item.username}`
                        })}
                      </div>
                      <div className='flex flex-col flex-1 '>
                        <a href='#' className='font-semibold text-slate-900'>
                          {item.username}
                          {/* {item.registeruid} */}
                        </a>
                        <span className='text-sm'>{formatshortdate(item.registerdate)}</span>
                      </div>
                    </div>
                  </div>
                  {/* //end user profile */}
                  {/* //start message */}
                  <div className='text-slate-600 text-sm mb-4'>{item.message}</div>
                  {/* //end message */}
                  {/* start reply tool */}
                  <div className='mb-4'>
                    <Chip
                      label='reply'
                      size='small'
                      className='mr-2'
                      icon={<i className='tabler-message' />}

                      //onClick={() => handleOpenReply(item.message, item.registeruid, item.itemno, item.level, 0)}
                    />
                    <Chip
                      label='150'
                      size='small'
                      icon={<i className='tabler-heart' />}

                      //onClick={handleClick}
                    />
                  </div>
                  {/* start reply content */}

                  {item.reply &&
                    item.reply.map((itemReply: any, idx: any) => {
                      return (
                        <div key={idx} className='flex flex-row mb-7 ps-10'>
                          <div className=' me-5'>
                            {getAvatar({
                              avatar: `${itemReply.avatar}`,
                              fullName: `${itemReply.username}`
                            })}
                          </div>
                          <div className='flex flex-col '>
                            <div className='flex flex-row align-items-center flex-wrap mb-1'>
                              <div className='flex flex-col flex-1'>
                                <a href='#' className='font-semibold text-slate-900 me-2'>
                                  {itemReply.username}
                                  {/* {itemReply.registeruid} */}
                                </a>
                                <span className='text-gray-400 text-sm'>{formatshortdate(itemReply.registerdate)}</span>
                              </div>

                              <div className='flex flex-none text-gray-400 text-sm'>
                                {/* <a href='#' className='ms-auto text-gray-400  fs-7 me-2'>
                                  Reply 33
                                </a> */}
                                <Chip
                                  label='reply'
                                  size='small'
                                  className='mr-2'

                                  // onClick={() =>
                                  //   handleOpenReply(
                                  //     itemReply.message,
                                  //     itemReply.registeruid,
                                  //     itemReply.itemno,
                                  //     itemReply.level,
                                  //     item.itemno // parent itemno
                                  //   )
                                  // }
                                />
                                <a
                                  href='#'
                                  className='btn btn-sm btn-icon btn-clear btn-active-light-danger'
                                  title='Love'
                                >
                                  <span className='m-0'>
                                    <i className='tabler-heart-filled text-lg' />
                                  </span>
                                </a>
                              </div>
                            </div>

                            <span className='text-slate-600 text-sm pt-1'>{itemReply.message}</span>
                          </div>
                        </div>
                      )
                    })}

                  {/* end reply content */}
                  <Divider className='mb-3' />
                  {/* end reply tool */}
                </div>
              ) // return
            })}
        </CardContent>
      </Card>
    </Drawer>
  )
}

export default CommentDrawer
