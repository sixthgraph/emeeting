import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'

import { useSession } from 'next-auth/react'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

import CustomTextField from '@/@core/components/mui/TextField'

import axios from '@/utils/axios'

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

const WorkMessage = ({ commentdetailData, commentWorkData }: { commentdetailData?: any; commentWorkData?: any }) => {
  console.log('commentdetailData')
  console.log(commentdetailData)

  let commentData: any
  let chatmember: any

  if (commentData) commentData = commentdetailData?.comment
  if (chatmember) chatmember = commentdetailData?.member

  console.log('chatmember---')
  console.log(chatmember)

  const { data: session } = useSession()
  const [commentList, setCommentList] = useState<any>(commentData)
  const token = session?.user.token

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialData = {
    wid: commentWorkData?.wid,
    registeruid: '',
    message: '',
    file: '',
    location: '',
    level: 0,
    itemno: 0,
    reply_itemno: 0
  }

  const initialReplyRef = {
    registeruid: '',
    message: '',
    itemno: 0,
    parent_itemno: ''
  }

  const [newMessage, setNewMessage] = useState<any>(initialData)
  const [replyRef, setReplyRef] = useState<any>(initialReplyRef)
  const [openReply, setOpenReply] = useState<boolean>(false)

  const itemsRef = useRef<HTMLInputElement>(null)
  const params = useParams()
  const { lang: locale } = params

  const handleClick = () => {
    console.info('You clicked the Chip.')
  }

  console.log('commentData')
  console.log(commentData)

  useEffect(() => {
    if (!openReply) setNewMessage(initialData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openReply])

  const handleReply = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/add`, newMessage)

      if (response.data.message === 'success') {
        console.log('---Call reply comment success.------------------')
        setNewMessage(initialData)
        setReplyRef(initialReplyRef)
        setOpenReply(false)
        getWorkMessage()
      } else {
        console.log(response.data.message)
      }
    } catch (error: any) {
      console.log('add reply comment failed. ', error.message)
    }
  }

  const handleOpenReply = (message: any, registeruid: any, itemno: any, level: any, parent_itemno: any) => {
    setOpenReply(true)

    // let parent_itemno: any

    let reply_itemno: any

    if (level == 0) {
      console.log('reply first level')
      parent_itemno = itemno
      reply_itemno = 0

      // setReplyRef({ ...replyRef, parent_itemno: parent_itemno2 })
    } else {
      console.log('reply second level')
      reply_itemno = itemno

      // parent_itemno = parentItemno
    }

    itemsRef?.current?.focus()
    setReplyRef({ ...replyRef, message: message, registeruid: registeruid, itemno: itemno })
    setNewMessage({
      ...newMessage,
      reply_itemno: reply_itemno,
      message: '',
      itemno: parent_itemno,
      level: 1,
      registeruid: ''
    }) //sg bug here

    console.log('handleOpenReply set newMessage to')
    console.log(newMessage)
  }

  const getWorkMessage = async () => {
    const reqBody = {
      wid: commentWorkData.wid,
      token: token
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/comment/list`, reqBody)
      const newCommentData = response.data

      if (newCommentData) {
        setCommentList(newCommentData.comment)
      }
    } catch (error: any) {
      console.log('Get work comment failed. ', error.message)
    }
  }

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/add`, newMessage)

      if (response.data.message === 'success') {
        console.log('---Call add comment success.------------------')
        setNewMessage(initialData)
        setReplyRef(initialReplyRef)
        setOpenReply(false)
        getWorkMessage()
      } else {
        console.log(response.data.message)
      }
    } catch (error: any) {
      console.log('add new comment failed. ', error.message)
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
      <Card variant='outlined'>
        <CardHeader title='Messages' />
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
                      onClick={() => handleOpenReply(item.message, item.registeruid, item.itemno, item.level, 0)}
                    />
                    <Chip label='150' size='small' icon={<i className='tabler-heart' />} onClick={handleClick} />
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
                                  onClick={() =>
                                    handleOpenReply(
                                      itemReply.message,
                                      itemReply.registeruid,
                                      itemReply.itemno,
                                      itemReply.level,
                                      item.itemno // parent itemno
                                    )
                                  }
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
        <CardActions>
          {openReply ? (
            <>
              <Card sx={{ width: 1 }} variant='outlined' className='bg-blue-50 p-2'>
                <CardContent className='flex flex-col p-0'>
                  <div className='flex p-2'>
                    <div className='flex-1'>
                      <Link className='text-sm text-primary' href='#'>
                        @{replyRef.registeruid}
                      </Link>
                      <Typography className='text-xs'>{replyRef.message}</Typography>
                    </div>
                    <IconButton
                      onClick={() => setOpenReply(false)}
                      style={{ width: 20, height: 20, padding: '0px' }}
                      aria-label='close'
                    >
                      <i className='tabler-square-rounded-plus text-lg font-extrabold' />
                    </IconButton>
                  </div>
                  <div>
                    <CustomTextField
                      id='reply-input'
                      name='reply-input'
                      variant='outlined'
                      fullWidth
                      ref={itemsRef}
                      placeholder='Type a reply message..'
                      value={newMessage.message}
                      className='bg-white border-white'
                      onChange={e => {
                        setNewMessage({ ...newMessage, message: e.target.value })
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onClick={handleReply}
                              onMouseDown={e => e.preventDefault()}
                              aria-label='send reply message'
                            >
                              <i className={'tabler-send'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <CustomTextField
              id='message-input'
              fullWidth
              placeholder='Type a message..'
              value={newMessage.message}
              onChange={e => {
                setNewMessage({ ...newMessage, message: e.target.value })
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleSendMessage}
                      onMouseDown={e => e.preventDefault()}
                      aria-label='send message'
                    >
                      <i className={'tabler-send'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
        </CardActions>
      </Card>
    </>
  )
}

export default WorkMessage
