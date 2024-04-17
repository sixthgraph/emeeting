// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { NextResponse } from 'next/server'
import { useRouter, useParams } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import { InputAdornment } from '@mui/material'

import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'

type Props = {
  open: boolean
  updateData: FormDataType
  handleClose: () => void
}

type FormDataType = {
  fullName: string
  username: string
  password: string
  email: string
  company: string
  country: string
  contact: string
  role: string
  plan: string
  status: string
}

// Vars
const initialData = {
  fullName: '',
  username: '',
  password: '',
  email: '',
  company: '',
  country: '',
  contact: '',
  role: '',
  plan: '',
  status: ''
}

const UserDrawerForm = ({ open, updateData, handleClose }: Props) => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params

  // States
  const [formData, setFormData] = useState<FormDataType>(initialData)

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
        message: 'User created successfully',
        success: true,
        response
      })

      /*
      const savedUser = await axios.post('http://localhost:9995/register', formData)
      return NextResponse.json({
        message: 'User created successfully',
        success: true,
        savedUser
      })
      */
    } catch (error: any) {
      console.log('Add user failed. ', error.message)
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData({
      fullName: '',
      username: '',
      password: '',
      email: '',
      company: '',
      country: '',
      contact: '',
      role: '',
      plan: '',
      status: ''
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
        {updateData.email !== '' ? (
          <Typography variant='h5'>Edit User</Typography>
        ) : (
          <Typography variant='h5'>Add New User</Typography>
        )}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            label='Full Name'
            fullWidth
            placeholder='John Doe'
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
          />
          <CustomTextField
            label='Username'
            fullWidth
            placeholder='johndoe'
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
          />
          <CustomTextField
            fullWidth
            label='Password'
            placeholder='············'
            autoComplete='off'
            type={isPasswordShown ? 'text' : 'password'}
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                    <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <CustomTextField
            label='Email'
            fullWidth
            placeholder='johndoe@gmail.com'
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <CustomTextField
            label='Company'
            fullWidth
            placeholder='Company PVT LTD'
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
          />
          <CustomTextField
            select
            fullWidth
            id='country'
            value={formData.country}
            onChange={e => setFormData({ ...formData, country: e.target.value })}
            label='Select Country'
            inputProps={{ placeholder: 'Country' }}
          >
            <MenuItem value='UK'>UK</MenuItem>
            <MenuItem value='USA'>USA</MenuItem>
            <MenuItem value='Australia'>Australia</MenuItem>
            <MenuItem value='Germany'>Germany</MenuItem>
          </CustomTextField>
          <CustomTextField
            label='Contact'
            type='number'
            fullWidth
            placeholder='(397) 294-5153'
            value={formData.contact}
            onChange={e => setFormData({ ...formData, contact: e.target.value })}
          />
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
            label='Select Role'
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='author'>Author</MenuItem>
            <MenuItem value='editor'>Editor</MenuItem>
            <MenuItem value='maintainer'>Maintainer</MenuItem>
            <MenuItem value='subscriber'>Subscriber</MenuItem>
          </CustomTextField>
          <CustomTextField
            select
            fullWidth
            id='select-plan'
            value={formData.plan}
            onChange={e => setFormData({ ...formData, plan: e.target.value })}
            label='Select Plan'
            inputProps={{ placeholder: 'Select Plan' }}
          >
            <MenuItem value='basic'>Basic</MenuItem>
            <MenuItem value='company'>Company</MenuItem>
            <MenuItem value='enterprise'>Enterprise</MenuItem>
            <MenuItem value='team'>Team</MenuItem>
          </CustomTextField>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            label='Select Status'
          >
            <MenuItem value='pending'>Pending</MenuItem>
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
          </CustomTextField>

          <div className='flex items-center gap-4'>
            {updateData.email !== '' ? (
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

export default UserDrawerForm
