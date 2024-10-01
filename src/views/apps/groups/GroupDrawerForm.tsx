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
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'

import { valibotResolver } from '@hookform/resolvers/valibot'
import type { Input } from 'valibot'

// import { set } from 'mongoose'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

import type { GroupFormDataType } from '@/types/apps/groupTypes'
import type { UsersType } from '@/types/apps/userTypes'
import { addGroupFormSchema } from '@/schemas/formSchema'

type FormData = Input<typeof addGroupFormSchema>

type ErrorType = {
  message: string[]
}

type Props = {
  open: boolean
  updateData: GroupFormDataType
  setData: any
  userData?: UsersType[]
  email?: string
  getGroupData: any
  handleClose: () => void
}

// Vars
const initialData = {
  groupid: '',
  groupname: '',
  createby: '',
  member: []
}

const GroupDrawerForm = ({ open, setData, updateData, userData, getGroupData, handleClose }: Props) => {
  // States
  const [formData, setFormData] = useState<GroupFormDataType>(initialData)
  const [userList, setUserList] = useState<any[]>(updateData.member)

  // const [errors, setErrors] = useState<any[]>([])
  const [personName, setPersonName] = useState<string[]>([])
  const [members, setMembers] = useState<string[]>([])
  const [memberopen, setmemberOpen] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  const { data: session } = useSession()
  const emailData = session?.user.email
  const token = session?.user.token

  //HOOK
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(addGroupFormSchema),
    defaultValues: {
      groupname: ''
    }
  })

  // const searchParams = useSearchParams()

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

  const onSubmit = async () => {
    /*===== remove this for enable require members ======*/
    // if (formData.member.length == 0) {
    //   console.log(formData)
    //   setErrorMember(true)

    //   return
    // }

    //   console.log(formData)
    // }
    /*===== remove this for enable require members ======*/

    // ADD
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/add`, formData)

      console.log(formData)

      console.log('Create response===', response.data)

      if (response.data.success) {
        // noon here

        handleClose()
        const newData = await getGroupData()

        setData(newData)
      } else {
        console.log('Create failed.')
      }

      setFormData(initialData)
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

  // const getGroupData = async () => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //       'Cache-Control': 'no-cache',
  //       Pragma: 'no-cache',
  //       Expires: '0'
  //     }

  //     const reqBody = { token: token }
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groups/list`, reqBody, { headers })

  //     if (response.data.message === 'success') {
  //       return response.data.data.detail
  //     } else {
  //       return 'Group not found'
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

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

        const newData = await getGroupData()

        setData(newData)
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

    console.log('newMember')
    console.log(newMember)

    for (const item of personName) {
      newMember.push(item)
    }

    if (updateData.member !== null) {
      setMembers(newMember)
      setFormData({ ...formData, member: newMember })
    } else {
      console.log('null')
    }

    handleCloseMembers()
  }

  const handleDeleteMember = async (email: any) => {
    const updatedMembers = userList.filter((newMember: any) => newMember !== email)

    if (updatedMembers.length !== members.length) {
      const members = updatedMembers

      setUserList(members)
      setMembers(members)
    } else {
      console.log('Member not found')
    }
  }

  useEffect(() => {
    setFormData(updateData)
    setUserList(updateData.member)

    if (open) {
      clearErrors()
    }
  }, [open, updateData, clearErrors])

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
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
          <Controller
            name='groupname'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                autoFocus
                fullWidth
                required
                label='Group Name'
                placeholder='Enter group name...'
                value={formData.groupname}
                onChange={e => {
                  setFormData({
                    groupid: formData.groupid,
                    groupname: e.target.value,
                    createby: String(emailData),
                    member: members
                  })
                  field.onChange(e.target.value)
                  errorState !== null && setErrorState(null)
                }}
                {...((errors.groupname || errorState !== null) && {
                  error: true,
                  helperText: errors?.groupname?.message || errorState?.message[0]
                })}
              />
            )}
          />

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
              <Button variant='contained' onClick={handleSubmit(onSubmit)} type='button'>
                Submit
              </Button>
            )}

            {/* <Button variant='contained' type='submit' onClick={() => setSubmitMode('register')}> */}
            {/* <Button variant='contained' type='submit' onClick={handleSubmit(handleUpdateData)}>
              CustomSubmit
            </Button> */}

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
