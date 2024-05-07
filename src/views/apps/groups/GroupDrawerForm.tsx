// // React Imports
import { useEffect, useState } from 'react'

// // MUI Imports
import { NextResponse } from 'next/server'
import { useRouter, useParams } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// // Component Imports
// import { InputAdornment } from '@mui/material'

import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'

type Props = {
  open: boolean
  updateData: GroupFormDataType
  handleClose: () => void
}

type GroupFormDataType = {
  GroupId: string
  Itemno: string
  Groupname: string
  Createby: string
  Member: string
}

// Vars
const initialData = {
  GroupId: '',
  Itemno: '',
  Groupname: '',
  Createby: '',
  Member: ''
}

const GroupDrawerForm = ({ open, updateData, handleClose }: Props) => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  // States
  const [formData, setFormData] = useState<GroupFormDataType>(initialData)

  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleClose()
    setFormData(initialData)

    try {
      const response = await axios.post('/api/apps/signup', formData) //console.log('Add user success. ', response.data)

      router.push(`/${locale}/users`)

      return NextResponse.json({
        message: 'Group created successfully',
        success: true,
        response
      })
    } catch (error: any) {
      console.log('Add group failed. ', error.message)
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData({
      GroupId: '',
      Itemno: '',
      Groupname: '',
      Createby: '',
      Member: ''
    })
  }

  const handleUpdateData = async () => {
    console.log('handleUpdateData start === ')
    console.log(formData)

    try {
      const response = await axios.post('/api/apps/user-update', formData)

      console.log('Update user success. ', response.data)

      return NextResponse.json({
        message: 'User created successfully',
        success: true,
        response
      })
    } catch (error: any) {
      console.log('Update user failed. ', error.message)
    }
  }

  useEffect(() => {
    console.log('open = ', open)
    setFormData(updateData)
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
        {updateData.GroupId !== '' ? (
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
          <CustomTextField
            label='Group Name'
            fullWidth
            placeholder='John Doe'
            value={formData.Groupname}
            onChange={e => setFormData({ ...formData, Groupname: e.target.value })}
          />
          <div className='flex items-center gap-4'>
            {updateData.GroupId !== '' ? (
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
    </Drawer>
  )
}

export default GroupDrawerForm
