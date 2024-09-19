'use client'

// React Imports
import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import axios from 'axios'

import { useSession } from 'next-auth/react'

import CustomTextField from '@core/components/mui/TextField'

import type { PositionsType } from '@/types/apps/positionTypes'
import { addPositionFormSchema } from '@/schemas/positionSchema'

type Props = {
  open: boolean
  updateData: any
  setData: any
  tableData?: PositionsType[]
  mode?: any
  handleClose: () => void
  updatePositionList: any
  curMaxPos: any
}

// Vars
const initialData = {
  positioncode: '',
  desc: '',
  level: 0,
  ref: '',
  status: 'Y',
  remark: '',
  create_date: '',
  create_by: '',
  update_date: '',
  update_by: ''
}

const initialInsertData = {
  positioncode: '',
  desc: '' // position name
}

const PositionDrawerForm = ({
  open,
  setData,
  updateData,
  tableData,
  mode,
  handleClose,
  updatePositionList,
  curMaxPos
}: Props) => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [insertData, setInsertData] = useState(initialInsertData)
  const [errors, setErrors] = useState<any[]>([])
  const { data: session } = useSession()
  const emailData = session?.user.email

  console.log('setData')
  console.log(setData)
  console.log('tableData')
  console.log(tableData)

  const handleInsertMany = async () => {
    console.log('insertData == ')
    console.log(insertData)

    const insertObj = []
    const depnameStr = insertData.desc
    const re = /\n/gi
    const result = depnameStr.replace(re, ',')
    const resultObj = result.split(',')

    let i: any
    const n: any = resultObj

    for (i in n) {
      let maxPositionStr = ''

      if (String(curMaxPos).length == 2) {
        maxPositionStr = '0' + String(curMaxPos)
      } else {
        maxPositionStr = curMaxPos
      }

      if (n[i] !== '') {
        const newData = {
          positioncode: maxPositionStr,
          desc: n[i],
          level: 0,
          ref: '',
          status: 'Y',
          remark: '',
          create_date: '',
          create_by: String(emailData),
          update_date: '',
          update_by: String(emailData)
        }

        insertObj.push(newData)
        curMaxPos++
      } //if
    } //for

    console.log('insertObj === ')
    console.log(insertObj)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/positions/addMany`, insertObj)

      console.log('Add response===', response.data)

      if (response.data.success) {
        console.log('Add success')
        updatePositionList()
        handleClose()
      } else {
        console.log('add failed.')
      }
    } catch (error: any) {
      console.log('Add position failed. ', error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //setFormData(initialData)

    //Add
    try {
      const newFormData: any = formData

      newFormData.create_by = String(emailData)
      newFormData.update_by = String(emailData)

      if (newFormData.level == '') newFormData.level = 0

      setFormData(newFormData)

      const parsedData = addPositionFormSchema.safeParse(formData)

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/positions/add`, formData)

      console.log('Add response===', response.data)

      if (response.data.success) {
        console.log('Add success')
        setFormData(initialData)
        updatePositionList()
        handleClose()
      } else {
        console.log('add failed.')
      }
    } catch (error: any) {
      console.log('Add position failed. ', error.message)
    }
  }

  //Reset
  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  const handleUpdateManyData = async () => {
    console.log('handleUpdateManyData under construction')
  }

  //Update
  const handleUpdateData = async () => {
    try {
      formData.update_by = String(emailData)

      const response = await axios.post('/api/positions/update', formData)

      console.log('position formdate=====')
      console.log(formData)
      console.log('response.data update one')
      console.log(response.data)

      if (response.data.message === 'success') {
        console.log('Update position success.')
        updatePositionList()
        handleClose()
      }
    } catch (error: any) {
      console.log('Update Position failed. ', error.message)
    }
  }

  useEffect(() => {
    setFormData(updateData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

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
        {mode == 'insert-one' && <Typography variant='h5'>Add New Position</Typography>}
        {mode == 'insert-many' && <Typography variant='h5'>Add New Positions</Typography>}
        {mode == 'update-one' && <Typography variant='h5'>Edit Position</Typography>}
        {mode == 'update-many' && <Typography variant='h5'>Edit Positions</Typography>}
        {mode == 'delete-many' && <Typography variant='h5'>Delete Positions</Typography>}
        {/* {updateData.positioncode !== '' ? (
          <Typography variant='h5'>Edit Position</Typography>
        ) : (
          <Typography variant='h5'>Add New Position</Typography>
        )} */}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          {mode == 'insert-one' && (
            <>
              <CustomTextField
                label='Position Code'
                fullWidth
                disabled
                placeholder=''
                value={formData.positioncode}
                onChange={e => setFormData({ ...formData, positioncode: e.target.value })}
              />
              {errors.find(error => error.for === 'positioncode')?.message}

              <CustomTextField
                label='Position Name'
                fullWidth
                placeholder=''
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value, positioncode: curMaxPos })}
              />
              {errors.find(error => error.for === 'desc')?.message}
            </>
          )}
          {mode == 'update-one' && (
            <>
              <CustomTextField
                label='Position Code'
                fullWidth
                disabled
                placeholder=''
                value={formData.positioncode}
                onChange={e => setFormData({ ...formData, positioncode: e.target.value })}
              />
              {errors.find(error => error.for === 'positioncode')?.message}

              <CustomTextField
                label='Position Name'
                fullWidth
                placeholder=''
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
              />
              {errors.find(error => error.for === 'desc')?.message}
            </>
          )}
          {(mode == 'insert-one' || mode == 'update-one') && (
            <>
              <CustomTextField
                label='Level'
                fullWidth
                placeholder=''
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
              />
              {errors.find(error => error.for === 'level')?.message}
              <CustomTextField
                label='Ref'
                fullWidth
                placeholder=''
                value={formData.ref}
                onChange={e => setFormData({ ...formData, ref: e.target.value })}
              />
              {errors.find(error => error.for === 'ref')?.message}
              <CustomTextField
                label='Status'
                fullWidth
                placeholder=''
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              />
              {errors.find(error => error.for === 'remark')?.message}
              <CustomTextField
                label='Remark'
                fullWidth
                placeholder=''
                value={formData.remark}
                onChange={e => setFormData({ ...formData, remark: e.target.value })}
              />
              {errors.find(error => error.for === 'remark')?.message}
            </>
          )}

          {mode == 'insert-many' && (
            <CustomTextField
              rows={16}
              multiline
              label='Position Name'
              onChange={e => setInsertData({ ...insertData, desc: e.target.value })}
            />
          )}

          {mode == 'update-many' && <Typography>Update many under construction...</Typography>}
          {mode == 'delete-many' && <Typography>Delete many under construction...</Typography>}

          {/* {updateData.positioncode !== '' ? ( // editPosition
            <>
              <CustomTextField
                label='Position Code'
                fullWidth
                placeholder=''
                value={formData.positioncode}
                onChange={e => setFormData({ ...formData, positioncode: e.target.value })}
              />
              {errors.find(error => error.for === 'positioncode')?.message}
              <CustomTextField
                label='Position Name'
                fullWidth
                placeholder=''
                value={formData.desc}
                onChange={e => setFormData({ ...formData, desc: e.target.value })}
              />
              {errors.find(error => error.for === 'desc')?.message}
              <CustomTextField
                label='Level'
                fullWidth
                placeholder=''
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
              />
              {errors.find(error => error.for === 'level')?.message}
              <CustomTextField
                label='Ref'
                fullWidth
                placeholder=''
                value={formData.ref}
                onChange={e => setFormData({ ...formData, ref: e.target.value })}
              />
              {errors.find(error => error.for === 'ref')?.message}
              <CustomTextField
                label='Status'
                fullWidth
                placeholder=''
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              />
              {errors.find(error => error.for === 'remark')?.message}
              <CustomTextField
                label='Remark'
                fullWidth
                placeholder=''
                value={formData.remark}
                onChange={e => setFormData({ ...formData, remark: e.target.value })}
              />
              {errors.find(error => error.for === 'remark')?.message}
            </>
          ) : (
            <>

              <CustomTextField
                rows={16}
                multiline
                label='Position Name'
                onChange={e => setInsertData({ ...insertData, desc: e.target.value })}
              />
            </>
          )} */}

          <div className='flex items-center gap-4'>
            {/* {updateData.positioncode !== '' ? (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant='contained' type='submit'>
                  Submit
                </Button>
                <Button variant='contained' type='button' onClick={() => handleInsertMany()}>
                  Insert Many
                </Button>
              </>
            )} */}

            {mode == 'insert-one' && (
              <Button variant='contained' type='submit'>
                Submit
              </Button>
            )}

            {mode == 'insert-many' && (
              <Button variant='contained' onClick={() => handleInsertMany()} type='button'>
                Submit
              </Button>
            )}
            {mode == 'update-one' && (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Update
              </Button>
            )}
            {mode == 'update-many' && (
              <Button variant='tonal' onClick={() => handleUpdateManyData()}>
                Update
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

export default PositionDrawerForm
