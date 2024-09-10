// React Imports

import { useEffect, useState } from 'react'

// MUI Imports
//import { NextResponse } from 'next/server'
//import { useRouter, useParams } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import axios from 'axios'

// Component Imports
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,

  // InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'

import { useSession } from 'next-auth/react'

// import ListItemAvatar from '@mui/material/ListItemAvatar'
// import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import MenuItem from '@mui/material/MenuItem'

// import CustomAvatar from '@/@core/components/mui/Avatar'
// import { getInitials } from '@/utils/getInitials'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

import type { GroupFormDataType, GroupType } from '@/types/apps/groupTypes'
import type { UsersType } from '@/types/apps/userTypes'
import { addGroupFormSchema } from '@/schemas/formSchema'

type Props = {
  open: boolean
  updateData: GroupFormDataType
  setData: any
  tableData?: GroupType[]
  userData?: UsersType[]
  email?: string

  handleClose: () => void
}

// Vars
const initialData = {
  groupid: '',
  groupname: '',
  createby: '',
  member: []
}

// const getAvatar = (params: Pick<any, 'avatar' | 'fullName'>) => {
//   const { avatar, fullName } = params

//   if (avatar) {
//     return <CustomAvatar src={avatar} size={45} variant='rounded' />
//   } else {
//     return (
//       <CustomAvatar size={45} variant='rounded'>
//         {getInitials(fullName as string)}
//       </CustomAvatar>
//     )
//   }
// }

const GroupDrawerForm = ({ open, setData, updateData, tableData, userData, handleClose }: Props) => {
  // States
  const [formData, setFormData] = useState<GroupFormDataType>(initialData)
  const [userList, setUserList] = useState<any[]>(updateData.member)
  const [errors, setErrors] = useState<any[]>([])
  const [personName, setPersonName] = useState<string[]>([])
  const [members, setMembers] = useState<string[]>([])
  const [memberopen, setmemberOpen] = useState(false)

  // const [updateMember, serUpdateMember] = useState<any[]>([])

  // const [count, setCount] = useState(0)

  const { data: session } = useSession()

  const emailData = session?.user.email
  const token = session?.user.token

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  if (updateData.member.length == 1) {
    if (updateData.member[0] == 'null') {
      updateData.member = []
    }
  }

  if (updateData.member == null) {
    updateData.member = []
  }

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormData(initialData)

    // ADD
    try {
      const parsedData = addGroupFormSchema.safeParse(formData)

      if (!parsedData.success) {
        const errArr: any[] = []
        const { errors: err } = parsedData.error

        //sg here
        for (let i = 0; i < err.length; i++) {
          errArr.push({ for: err[i].path[0], message: err[i].message })
          setErrors(errArr)
        }

        setErrors(errArr)

        throw err
      }

      console.log('Form submitted successfully', parsedData.data)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/add`, formData)

      console.log('Create response===', response.data)

      if (response.data.success) {
        console.log('Create success')

        if (tableData) {
          const updateData: any = {
            groupid: formData.groupid,
            groupname: formData.groupname,
            createby: String(emailData),
            member: formData.member
          }

          tableData.push(updateData)
        }

        setData(tableData)
        handleClose()
      } else {
        console.log('Create failed.')
      }
    } catch (error: any) {
      console.log('Add group failed. ', error.message)
    }
  }

  const handleReset = () => {
    handleClose()
    setPersonName([])
    setFormData({
      groupid: '',
      groupname: '',
      createby: '',
      member: []
    })
  }

  const handleUpdateData = async () => {
    const newFormData: any = {
      groupid: formData.groupid,
      groupname: formData.groupname,
      createby: String(emailData),
      member: userList
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/update`, newFormData)

      if (response.data.message === 'success') {
        console.log('Update user success.')
        handleClose()

        const index = tableData?.findIndex(x => x.groupid !== formData.groupid)

        console.log('newUpdate === ', index)
        setData(index)

        if (tableData) {
          tableData[Number(index)].groupname = formData.groupname
          tableData[Number(index)].member = formData.member
        }

        setData(tableData)
      }
    } catch (error: any) {
      console.log('Update user failed. ', error.message)
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

      const userListObj = []

      for (const item of response.data) {
        userListObj.push(item)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleClickOpenMember = async () => {
    if (userList == undefined) {
      getUserList()
    }

    setmemberOpen(true)
  }

  const handleChange = (event: any) => {
    setPersonName(event.target.value as string[])
  }

  const handleCloseMembers = () => {
    setmemberOpen(false)
    setPersonName([])

    // setmemberOpen(false)
  }

  const handleAddMember = () => {
    console.log('Add member edit')
    const newMember: any = userList

    for (const item of personName) {
      newMember.push(item)
    }

    if (updateData.member !== null) {
      console.log('update == ')
      console.log(updateData.member)

      // setUserList(newMember)
      // serUpdateMember(updateData.member)
    } else {
      console.log('null')
    }

    handleCloseMembers()
  }

  const handleDeleteMember = async (email: any) => {
    console.log('noon test-----')
    console.log('members strat -- ', members)

    const updatedMembers = userList.filter((newMember: any) => newMember !== email)

    if (updatedMembers.length !== members.length) {
      const members = updatedMembers

      setUserList(members)
      setMembers(members)

      console.log('Updated Members ----- ', members)
    } else {
      console.log('ไม่เจอ')
    }
  }

  useEffect(() => {
    setFormData(updateData)
    setUserList(updateData.member)
  }, [open, updateData])

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
        {updateData.groupname !== '' ? (
          <Typography variant='h5'>Edit Group</Typography>
        ) : (
          <Typography variant='h5'>Add New Group</Typography>
        )}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          {/* <CustomTextField
            label='member'
            fullWidth
            placeholder=''
            inputProps={{ minlength: 3, maxLength: 150 }}
            value={formData.member}

            //onChange={e => setFormData({ ...formData, groupname: e.target.value })}
            // onChange={e => setFormData({ groupname: e.target.value, createby: String(emailData), member: [] })}
          /> */}
          <CustomTextField
            label='Groupname'
            fullWidth
            placeholder=''
            value={formData.groupname} //onChange={e => setFormData({ ...formData, groupname: e.target.value })}
            onChange={e =>
              setFormData({
                groupid: formData.groupid,
                groupname: e.target.value,
                createby: String(emailData),
                member: formData.member
              })
            }
          />
          {errors.find(error => error.for === 'Groupname')?.message}

          <div className='flex flex-row'>
            <label className=' text-xs flex-1 '>Members</label>
            <Chip
              label='Add'
              size='small'
              variant='outlined'
              className='text-xs'
              icon={<i className='tabler-square-rounded-plus' />}
              onClick={handleClickOpenMember}
            />
          </div>

          <div className='flex gap-4 flex-col'>
            <List>
              {userList.length > 0 ? (
                userList?.map((email: any, index: any) => {
                  return (
                    <div key={index}>
                      <ListItem
                        disablePadding
                        secondaryAction={
                          <IconButton edge='end' size='small' onClick={() => handleDeleteMember(email)}>
                            <i className='tabler-trash-x' />
                          </IconButton>
                        }
                      >
                        <ListItemButton>
                          <ListItemText primary={email} />
                        </ListItemButton>
                      </ListItem>
                      <Divider className='m-0' />
                    </div>
                  )
                })
              ) : (
                <>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary={`Members not found`} />
                    </ListItemButton>
                  </ListItem>
                  <Divider className='m-0' />
                </>
              )}
            </List>
          </div>

          <div className='flex items-center gap-4'>
            {updateData.groupname !== '' ? (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Edit
              </Button>
            ) : (
              <Button variant='contained' type='submit'>
                Submit
              </Button>
            )}

            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

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
                {userData?.map((name, index) => (
                  <MenuItem key={index} value={name.email}>
                    {name.firstname + ' ' + name.lastname}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          </DialogContent>
          <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
            <Button variant='contained' type='submit' onClick={handleAddMember}>
              Add Members
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleCloseMembers()}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Drawer>
  )
}

export default GroupDrawerForm
