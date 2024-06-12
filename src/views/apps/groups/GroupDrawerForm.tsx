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

import type { GroupFormDataType, GroupType } from '@/types/apps/groupTypes'
import type { UsersType } from '@/types/apps/userTypes'
import { addGroupFormSchema } from '@/schemas/formSchema'

import { useSession } from 'next-auth/react'

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
var initialData = {
  groupname: '',
  createby: '',
  member: []
}

const GroupDrawerForm = ({ open, setData, updateData, tableData, userData, email, handleClose }: Props) => {
  // States
  const [formData, setFormData] = useState<GroupFormDataType>(initialData)
  const [errors, setErrors] = useState<any[]>([])

  const { data: session, update } = useSession()
  const [emailData, setEmailData] = useState(session?.user.email)

  console.log(emailData)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormData(initialData)
    console.log(initialData)
    //console.log(emailData)
    //setFormData({ groupname: 'eeeee', createby: 'fasdfadsf', member: [] })

    console.log('formData')
    console.log(formData)

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
            groupname: formData.groupname,
            createby: String(emailData),
            member: ''
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

  // Reset
  const handleReset = () => {
    handleClose()
    setFormData({
      groupname: '',
      createby: '',
      member: []
    })
  }

  // Update
  const handleUpdateData = async () => {
    try {
      const response = await axios.post('/api/groups/update', formData)

      if (response.data.message === 'success') {
        console.log('Update user success.')
        handleClose()

        const index = tableData?.findIndex(x => x.groupname == formData.groupname)

        console.log('newUpdate === ', index)
        setData(index)

        if (tableData) {
          tableData[Number(index)].groupname = formData.groupname
          tableData[Number(index)].createby = String(emailData)
          tableData[Number(index)].member = formData.member
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
          <CustomTextField
            label='Groupname'
            fullWidth
            placeholder=''
            value={formData.groupname}
            //onChange={e => setFormData({ ...formData, groupname: e.target.value })}
            onChange={e => setFormData({ groupname: e.target.value, createby: String(emailData), member: [] })}
          />
          {errors.find(error => error.for === 'Groupname')?.message}

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
    </Drawer>
  )
}

export default GroupDrawerForm
