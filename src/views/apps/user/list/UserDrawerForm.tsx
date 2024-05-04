// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
//import { NextResponse } from 'next/server'
//import { useRouter, useParams } from 'next/navigation'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import { InputAdornment } from '@mui/material'

import axios from 'axios'

// import { any } from 'zod'

// import { any } from 'zod'

import CustomTextField from '@core/components/mui/TextField'

import type { DepType, RoleType, UserFormDataType, UsersType } from '@/types/apps/userTypes'
import { addUserFormSchema } from '@/schemas/formSchema'

type Props = {
  open: boolean
  updateData: UserFormDataType
  setData: any
  tableData?: UsersType[]
  roleData?: RoleType[]
  depData?: DepType[]
  handleClose: () => void
}

// Vars
const initialData = {
  firstname: '',
  lastname: '',
  fullName: '',
  email: '',
  password: '',
  avatar: '',
  avatarcolor: '',
  dep: '',
  position: '',
  role: 0,
  status: ''
}

const UserDrawerForm = ({ open, setData, updateData, tableData, roleData, depData, handleClose }: Props) => {
  //const router = useRouter()
  //const params = useParams()
  //const { lang: locale } = params

  // States
  const [formData, setFormData] = useState<UserFormDataType>(initialData)
  const [errors, setErrors] = useState<any[]>([])

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormData(initialData)

    try {
      const parsedData = addUserFormSchema.safeParse(formData)

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, formData)

      console.log('signup response===', response.data)

      if (response.data.success) {
        console.log('signup success')

        if (tableData) {
          const updateData: any = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            dep: formData.dep,
            position: formData.position,
            role: Number(formData.role),
            status: formData.status
          }

          tableData.push(updateData)
        }

        setData(tableData)
        handleClose()
      } else {
        console.log('register failed.')
      }
    } catch (error: any) {
      console.log('Add user failed. ', error.message)
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData({
      firstname: '',
      lastname: '',
      fullName: '',
      email: '',
      password: '',
      avatar: '',
      avatarcolor: '',
      dep: '',
      position: '',
      role: 0,
      status: ''
    })
  }

  const handleUpdateData = async () => {
    try {
      const response = await axios.post('/api/users/update', formData)

      if (response.data.message === 'success') {
        console.log('Update user success.')
        handleClose()

        const index = tableData?.findIndex(x => x.email == formData.email)

        if (tableData) {
          //const newUpdate = { ...tableData[Number(foundIndex)], formData }
          // tableData[Number(index)].password = formData.password
          //tableData[Number(index)]
          tableData[Number(index)].firstname = formData.firstname
          tableData[Number(index)].lastname = formData.lastname
          tableData[Number(index)].dep = formData.dep
          tableData[Number(index)].position = formData.position
          tableData[Number(index)].role = String(formData.role)
          tableData[Number(index)].status = formData.status
        }

        setData(tableData)
      }
    } catch (error: any) {
      console.log('Update user failed. ', error.message)
    }
  }

  useEffect(() => {
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
            label='Firstname'
            fullWidth
            placeholder=''
            value={formData.firstname}
            onChange={e => setFormData({ ...formData, firstname: e.target.value })}
          />
          {errors.find(error => error.for === 'firstname')?.message}
          <CustomTextField
            label='Lastname'
            fullWidth
            placeholder='johndoe'
            value={formData.lastname}
            onChange={e => setFormData({ ...formData, lastname: e.target.value })}
          />
          {errors.find(error => error.for === 'lastname')?.message}
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
          {errors.find(error => error.for === 'password')?.message}
          {updateData.email !== '' ? (
            <CustomTextField
              label='Email'
              disabled
              fullWidth
              placeholder='your_email@gmail.com'
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          ) : (
            <CustomTextField
              label='Email'
              fullWidth
              placeholder='your_email@gmail.com'
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          )}
          {errors.find(error => error.for === 'email')?.message}
          <CustomTextField
            select
            fullWidth
            id='select-department'
            value={formData.dep}
            onChange={e => setFormData({ ...formData, dep: e.target.value })}
            label='Department'
          >
            {/* todo */}
            {depData?.map((dep: any) => {
              return (
                <MenuItem key={dep.dep} value={dep.dep}>
                  {dep.depname}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'department')?.message}
          <CustomTextField
            label='Position'
            fullWidth
            placeholder=''
            value={formData.position}
            onChange={e => setFormData({ ...formData, position: e.target.value })}
          />
          {errors.find(error => error.for === 'position')?.message}
          <CustomTextField
            select
            fullWidth
            id='Role'
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: Number(e.target.value) })}
            label='Role'
          >
            {/* todo */}
            {roleData?.map((role: any) => {
              return (
                <MenuItem key={role.roleid} value={role.roleid}>
                  {role.rolename}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'role')?.message}
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            label='Status'
          >
            <MenuItem value='pending'>Pending</MenuItem>
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
          </CustomTextField>
          {errors.find(error => error.for === 'status')?.message}
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
