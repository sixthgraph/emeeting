'use client'
import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Typography
} from '@mui/material'

import { useSession } from 'next-auth/react'

import axios from '@/utils/axios'
import CustomAvatar from '@/@core/components/mui/Avatar'

import { getInitials } from '@/utils/getInitials'
import CustomTextField from '@/@core/components/mui/TextField'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

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
  const initialData = {
    wid: wid,
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

  const { data: session } = useSession()
  const [workData, setWorkData] = useState<any>({})
  const [userList, setUserList] = useState<any>()
  const [commentList, setCommentList] = useState<any>([])
  const [members, setMembers] = useState<string[]>([])
  const [memberList, setMemberList] = useState<any>([])
  const [memberopen, setmemberOpen] = useState(false)
  const [openReply, setOpenReply] = useState<boolean>(false)
  const itemsRef = useRef<HTMLInputElement>(null)
  const [newMessage, setNewMessage] = useState<any>(initialData)
  const [replyRef, setReplyRef] = useState<any>(initialReplyRef)
  const [personName, setPersonName] = useState<string[]>([])

  const token = session?.user.token
  const email = session?.user.email

  const params = useParams()
  const { lang: locale } = params

  useEffect(() => {
    open && getData({ wid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const getData = async ({ wid }: { wid?: any }) => {
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

      setWorkData(data[0].workInfo)

      const dataObj = []

      for (const item of data) {
        setCommentList(item.comment)
        setMemberList(item.member)

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
    handleClose() //setFormData(initialData)
  }

  const handleCloseMembers = () => {
    setmemberOpen(false)
  }

  const handleSubmitMember = async () => {
    for (const item of personName) {
      members.push(item)
    }

    const upudateNewUserList: any = {
      wid: workData?.wid,
      email: members,
      invite_by: email
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/invite`, upudateNewUserList)

      if (response.data.message === 'success') {
        setMembers(members)
        handleReset()
      }
    } catch (error: any) {
      console.log('Update Team member failed. ', error.message)
    }
  }

  const handleChange = (event: any) => {
    setPersonName(event.target.value as string[])
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  const getUserList = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/get-user-list`, token, { headers })

      setUserList(response.data)

      //const userListObject = response.data

      const userListObj = []

      for (const item of response.data) {
        userListObj.push(item)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleOpenReply = (message: any, registeruid: any, itemno: any, level: any, parent_itemno: any) => {
    setOpenReply(true)

    // let parent_itemno: any

    let reply_itemno: any

    if (level == 0) {
      parent_itemno = itemno
      reply_itemno = 0

      // setReplyRef({ ...replyRef, parent_itemno: parent_itemno2 })
    } else {
      reply_itemno = itemno
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
  }

  const handleClickOpenMember = async () => {
    if (userList == undefined) {
      getUserList()
    } else {
      interface User {
        email: string
      }

      const chatMemberEmails = new Set(memberList.map(({ email }: User) => email))

      const result = userList.filter(function (this: Set<string>, { email }: User) {
        return !this.has(email)
      }, chatMemberEmails)

      setUserList(result)
    }

    setmemberOpen(true)
  }

  const handleClick = () => {
    console.info('You clicked the Chip.')
  }

  const getWorkMessage = async () => {
    const reqBody = {
      wid: workData?.wid,
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
        setNewMessage(initialData)
        setReplyRef(initialReplyRef)
        setOpenReply(false)
        getWorkMessage()
      }
    } catch (error: any) {
      console.log('add new comment failed. ', error.message)
    }
  }

  const handleReply = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/add`, newMessage)

      if (response.data.message === 'success') {
        setNewMessage(initialData)
        setReplyRef(initialReplyRef)
        setOpenReply(false)
        getWorkMessage()
      }
    } catch (error: any) {
      console.log('add reply comment failed. ', error.message)
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
            <Typography variant='h5'>{`${workData?.subject}`}</Typography>
            <Typography variant='body2'> {`Work ID : ${workData?.wid}`}</Typography>
          </div>
          <IconButton onClick={handleClose}>
            <i className='tabler-x text-textPrimary' />
          </IconButton>
        </div>
        <Divider />

        <Card variant='outlined'>
          <CardHeader
            title='Messages'
            action={
              <Chip
                label='Invite'
                size='small'
                variant='outlined'
                className='text-xs'
                icon={<i className='tabler-plus' />}
                onClick={() => {
                  handleClickOpenMember()
                }}
              />
            }
            className='pbe-4'
          />
          <CardContent className='pb-0' style={{ maxHeight: '560px', overflow: 'auto' }}>
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
                                  <span className='text-gray-400 text-sm'>
                                    {formatshortdate(itemReply.registerdate)}
                                  </span>
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
      </Drawer>
      <Dialog
        fullWidth
        open={memberopen}
        onClose={handleCloseMembers}
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => handleCloseMembers()} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          Team member
          <Typography component='span' className='flex flex-col text-center'>
            Share project with the team member
          </Typography>
        </DialogTitle>
        <form onSubmit={e => e.preventDefault()}>
          <DialogContent className='MuiDialogContent-root flex flex-col gap-6 pbs-0 sm:pli-16 sm:pbe-16 mui-18zuta7'>
            <div>
              <CustomTextField
                select
                fullWidth
                label='Add Members'
                value={personName}
                id='demo-multiple-chip'
                SelectProps={{
                  multiple: true,
                  MenuProps,
                  onChange: e => handleChange(e),
                  renderValue: selected => (
                    <div className='flex flex-wrap gap-1'>
                      {(selected as unknown as string[]).map(value => (
                        <Chip key={value} label={value} size='small' />
                      ))}
                    </div>
                  )
                }}
              >
                {userList?.map((user: any, index: any) => (
                  <MenuItem key={index} value={user.email}>
                    {user.firstname} {user.lastname}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
            <div className='flex flex-col gap-4'>
              {memberList?.length} Members
              <List className='pt-0 px-0'>
                {memberList?.map((user: any, index: any) => (
                  <ListItem key={index} disablePadding onClick={() => handleCloseMembers()}>
                    <ListItemButton>
                      <ListItemAvatar>
                        {getAvatar({
                          avatar: `${user.avatar}`,
                          fullName: `${user.username}`
                        })}
                        {/* <Avatar>
                          <i className='tabler-user' />
                        </Avatar> */}
                      </ListItemAvatar>
                      <ListItemText primary={user.username} secondary={user.email} />
                      {/* <ListItemText primary={user.firstname} {user.lastname} /> */}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </DialogContent>
          <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
            <Button variant='contained' onClick={() => handleSubmitMember()} type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default CommentDrawer
