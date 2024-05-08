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
import { addUserFormSchema } from '@/schemas/formSchema'

type Props = {
  open: boolean
  updateData: GroupFormDataType
  setData: any
  tableData?: GroupType[]
  handleClose: () => void
}

// Vars
const initialData = {
  groupid: '',
  itemno: '',
  groupname: '',
  createby: '',
  member: ''
}

const GroupDrawerForm = ({ open, setData, updateData, tableData, handleClose }: Props) => {
  // States
  const [formData, setFormData] = useState<GroupFormDataType>(initialData)
  const [errors, setErrors] = useState<any[]>([])

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
            Groupname: formData.groupname,
            Member: formData.member
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
      groupname: '',
      member: ''
    })
  }

  const handleUpdateData = async () => {
    try {
      const response = await axios.post('/api/users/update', formData)

      if (response.data.message === 'success') {
        console.log('Update user success.')
        handleClose()

        const index = tableData?.findIndex(x => x.groupname == formData.groupname)

        if (tableData) {
          //const newUpdate = { ...tableData[Number(foundIndex)], formData }
          // tableData[Number(index)].password = formData.password
          //tableData[Number(index)]
          tableData[Number(index)].groupname = formData.groupname
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
            onChange={e => setFormData({ ...formData, groupname: e.target.value })}
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
