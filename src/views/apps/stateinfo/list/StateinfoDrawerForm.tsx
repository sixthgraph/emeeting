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

import type { StateinfoFormDataType, StateinfosType } from '@/types/apps/stateinfoTypes'
import { addStateinfoFormSchema } from '@/schemas/stateinfoSchema'
import { useSession } from 'next-auth/react'
import router, { useRouter } from 'next/router'

type Props = {
  open: boolean
  updateData: StateinfoFormDataType
  setData: any
  tableData?: StateinfosType[]
  handleClose: () => void
}

// Vars
const initialData = {
  statecode: '',
  desc: '',
  ref: '',
  remark: '',
  create_date: '',
  create_by: '',
  update_date: '',
  update_by: ''
}

const StateinfoDrawerForm = ({ open, setData, updateData, tableData, handleClose }: Props) => {
  //const router = useRouter()
  //const params = useParams()
  //const { lang: locale } = params

  // States
  const [formData, setFormData] = useState<StateinfoFormDataType>(initialData)
  const [errors, setErrors] = useState<any[]>([])

  const { data: session } = useSession()
  const emailData = session?.user.email

  const handleRefresh = () => {
    //router.reload()
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormData(initialData)

    //Add
    try {
      const parsedData = addStateinfoFormSchema.safeParse(formData)

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stateinfos/add`, formData)

      console.log('Add response===', response.data)

      if (response.data.success) {
        console.log('Add success')

        if (tableData) {
          const addData: any = {
            statecode: formData.statecode,
            desc: formData.desc,
            ref: formData.ref,
            remark: formData.remark,
            create_date: '',
            create_by: String(emailData),
            update_date: '',
            update_by: String(emailData)
          }

          console.log(addData)

          tableData.push(addData)
        }

        setData(tableData)
        handleClose()
        handleRefresh()
      } else {
        console.log('add failed.')
      }
    } catch (error: any) {
      console.log('Add stateinfo failed. ', error.message)
    }
  }

  //Reset
  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  //Update
  const handleUpdateData = async () => {
    try {
      const response = await axios.post('/api/stateinfos/update', formData)

      console.log('stateinfo formdate=====')
      console.log(formData)
      console.log(response.data)

      if (response.data.message === 'success') {
        console.log('Update stateinfo success.')
        handleClose()

        const index = tableData?.findIndex(x => x.statecode == formData.statecode)
        console.log('index=>' + index)
        if (tableData) {
          //const newUpdate = { ...tableData[Number(foundIndex)], formData }
          // tableData[Number(index)].password = formData.password
          //tableData[Number(index)]

          tableData[Number(index)].statecode = formData.statecode
          tableData[Number(index)].desc = formData.desc
          tableData[Number(index)].ref = formData.ref
          tableData[Number(index)].remark = formData.remark

          console.log('email=>' + String(emailData))
          if (tableData) {
            const updateData: any = {
              statecode: formData.statecode,
              desc: formData.desc,
              ref: formData.ref,
              remark: formData.remark,
              update_date: '',
              update_by: emailData
            }
            console.log('updateData=====')
            console.log(updateData)
            tableData.push(updateData)
          }
        }

        setData(tableData)
      }
    } catch (error: any) {
      console.log('Update stateinfo failed. ', error.message)
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
        {updateData.statecode !== '' ? (
          <Typography variant='h5'>Edit Stateinfo</Typography>
        ) : (
          <Typography variant='h5'>Add New Stateinfo</Typography>
        )}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            label='Statecode'
            fullWidth
            placeholder=''
            value={formData.statecode}
            onChange={e => setFormData({ ...formData, statecode: e.target.value })}
          />
          {errors.find(error => error.for === 'statecode')?.message}
          <CustomTextField
            label='Desc'
            fullWidth
            placeholder=''
            value={formData.desc}
            onChange={e => setFormData({ ...formData, desc: e.target.value })}
          />
          {errors.find(error => error.for === 'desc')?.message}
          <CustomTextField
            label='Ref'
            fullWidth
            placeholder=''
            value={formData.ref}
            onChange={e => setFormData({ ...formData, ref: e.target.value })}
          />
          {errors.find(error => error.for === 'ref')?.message}
          <CustomTextField
            label='Remark'
            fullWidth
            placeholder=''
            value={formData.remark}
            onChange={e => setFormData({ ...formData, remark: e.target.value })}
          />
          {errors.find(error => error.for === 'update_date')?.message}
          <div className='flex items-center gap-4'>
            {updateData.statecode !== '' ? (
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

export default StateinfoDrawerForm