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

import axios from 'axios'

// import { any } from 'zod'

// import { any } from 'zod'

import CustomTextField from '@core/components/mui/TextField'

import type {
  DepParentType,
  DepartmentFormDataType,
  DepartmentsType,
  StateinfoType
} from '@/types/apps/departmentTypes'
import { addUserFormSchema } from '@/schemas/formSchema' //NP????

type Props = {
  open: boolean
  updateData: DepartmentFormDataType
  setData: any
  tableData?: DepartmentsType[]
  stateinfoData?: StateinfoType[]
  depParentData?: DepParentType[]
  handleClose: () => void
}

// Vars
const initialData = {
  dep: '',
  depname: '',
  statecode: '',
  docuname: 0,
  path: '',
  parent: '',
  sort: 0
}

const DepartmentDrawerForm = ({
  open,
  setData,
  updateData,
  tableData,
  stateinfoData,
  depParentData,
  handleClose
}: Props) => {
  //const router = useRouter()
  //const params = useParams()
  //const { lang: locale } = params

  // States
  const [formData, setFormData] = useState<DepartmentFormDataType>(initialData)
  const [errors, setErrors] = useState<any[]>([])

  // const [isPasswordShown, setIsPasswordShown] = useState(false)
  // const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // const handleRefresh = () => {
  //   //router.reload()
  //   setTimeout(() => {
  //     window.location.reload()
  //   }, 100)
  // }

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/department/add`, formData)

      console.log('add department response===', response.data)

      if (response.data.success) {
        console.log('add department success')

        if (tableData) {
          const updateData: any = {
            depname: formData.depname,
            statecode: formData.statecode,
            docuname: formData.docuname,
            path: formData.path,
            sort: formData.sort
          }

          tableData.push(updateData)
        }

        setData(tableData)
        handleClose()
      } else {
        console.log('add department failed.')
      }
    } catch (error: any) {
      console.log('Add department failed. ', error.message)
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  const handleUpdateData = async () => {
    try {
      const response = await axios.post('/api/department/update', formData)

      if (response.data.message === 'success') {
        console.log('Update department success.')
        handleClose()

        const index = tableData?.findIndex(x => x.dep == formData.dep)

        if (tableData) {
          //const newUpdate = { ...tableData[Number(foundIndex)], formData }
          // tableData[Number(index)].password = formData.password
          //tableData[Number(index)]
          tableData[Number(index)].depname = formData.depname
          tableData[Number(index)].statecode = formData.statecode
          tableData[Number(index)].docuname = formData.docuname
          tableData[Number(index)].path = formData.path
          tableData[Number(index)].sort = formData.sort
        }

        setData(tableData)
      }
    } catch (error: any) {
      console.log('Update department failed. ', error.message)
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
        {updateData.depname !== '' ? (
          <Typography variant='h5'>Edit Department</Typography>
        ) : (
          <Typography variant='h5'>Add New Department</Typography>
        )}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            select
            fullWidth
            id='select-department'
            value={formData.parent}
            onChange={e => setFormData({ ...formData, parent: e.target.value })}
            label='Parent Department'
          >
            {depParentData?.map((parentData: any) => {
              return (
                <MenuItem key={parentData.dep} value={parentData.dep}>
                  {parentData.depname}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'parent')?.message}
          <CustomTextField
            label='Depname'
            fullWidth
            placeholder=''
            value={formData.depname}
            onChange={e => setFormData({ ...formData, depname: e.target.value })}
          />
          {errors.find(error => error.for === 'depname')?.message}

          <CustomTextField
            label='Path'
            fullWidth
            placeholder=''
            value={formData.path}
            onChange={e => setFormData({ ...formData, path: e.target.value })}
          />
          {errors.find(error => error.for === 'path')?.message}
          <CustomTextField
            select
            fullWidth
            id='select-statecode'
            value={formData.statecode}
            onChange={e => setFormData({ ...formData, statecode: e.target.value })}
            label='Statecode'
          >
            {stateinfoData?.map((stateinfo: any) => {
              return (
                <MenuItem key={stateinfo.statecode} value={stateinfo.statecode}>
                  {stateinfo.desc}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'statecode')?.message}
          <CustomTextField
            label='Docuname'
            fullWidth
            placeholder=''
            value={formData.docuname}
            onChange={e => setFormData({ ...formData, docuname: parseInt(e.target.value) })}
          />
          {errors.find(error => error.for === 'docuname')?.message}
          <CustomTextField
            label='Sort'
            fullWidth
            placeholder=''
            value={formData.sort}
            onChange={e => setFormData({ ...formData, sort: parseInt(e.target.value) })}
          />
          {errors.find(error => error.for === 'docuname')?.message}
          <div className='flex items-center gap-4'>
            {updateData.dep !== '' ? (
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

export default DepartmentDrawerForm
