// React Imports
import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports

import axios from 'axios'

import { useSession } from 'next-auth/react'

import CustomTextField from '@core/components/mui/TextField'

import type { DepartmentFormDataType, DepartmentsType, StateinfoType } from '@/types/apps/departmentTypes'

import { addDepartmentFormSchema } from '@/schemas/departmentSchema' //NP????
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'

type Props = {
  open: boolean
  updateData: any
  setData: any
  tableData?: DepartmentsType[]
  stateinfoData?: StateinfoType[]
  rowData?: any
  handleClose: () => void
  mode?: any
  updateDepartmentList: any
}

// Vars
const initialData = {
  dep: '',
  depname: '',
  statecode: '01',
  docuname: 0,
  path: '',
  parent: '',
  sort: 0,
  ref: '',
  remark: '',
  create_date: '',
  create_by: '',
  update_date: '',
  update_by: ''
}

const initialInsertData = {
  parent: '',
  path: '',
  depname: ''
}

const DepartmentDrawerForm = ({
  open,
  setData,
  updateData,
  tableData,
  stateinfoData,
  rowData,
  handleClose,
  mode,
  updateDepartmentList
}: Props) => {
  // States
  const [formData, setFormData] = useState<DepartmentFormDataType>(initialData)
  const [errors, setErrors] = useState<any[]>([])
  const [insertData, setInsertData] = useState(initialInsertData)
  const { data: session } = useSession()
  const emailData = session?.user.email

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormData(initialData)

    try {
      console.log(formData.statecode)
      formData.create_by = String(emailData)
      formData.update_by = String(emailData)

      const parsedData = addDepartmentFormSchema.safeParse(formData)

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/add`, formData)

      console.log('add department response===', response.data)

      if (response.data.success) {
        console.log('add department success')

        if (tableData) {
          const addData: any = {
            depname: formData.depname,
            statecode: formData.statecode,
            docuname: formData.docuname,
            path: formData.path,
            sort: formData.sort
          }

          console.log(addData)

          tableData.push(addData)
        }

        setData(tableData)
        handleClose()
        handleRefresh()
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

  const handleInsertMany = async () => {
    const insertObj = []
    const depnameStr = insertData.depname
    const re = /\n/gi
    const result = depnameStr.replace(re, ',')
    const resultObj = result.split(',')

    let i: any
    const n: any = resultObj

    for (i in n) {
      if (n[i] !== '') {
        const newData = {
          dep: '',
          depname: n[i],
          statecode: '01',
          docuname: 0,
          path: insertData.path,
          parent: insertData.parent,
          sort: 0,
          ref: '',
          remark: '',
          create_date: '',
          create_by: String(emailData),
          update_date: '',
          update_by: String(emailData)
        }

        insertObj.push(newData)
      } //if
    } //for

    console.log('insertObj === ')
    console.log(insertObj)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/addMany`, insertObj)

      console.log('add department response===', response.data)

      if (response.data.success) {
        console.log('add department success')

        // if (tableData) {
        //   const addData: any = {
        //     depname: formData.depname,
        //     statecode: formData.statecode,
        //     docuname: formData.docuname,
        //     path: formData.path,
        //     sort: formData.sort
        //   }

        //   console.log(addData)

        //   tableData.push(addData)
        // }

        // setData(tableData)
        handleClose()
        handleRefresh()
      } else {
        console.log('add department failed.')
      }
    } catch (error: any) {
      console.log('Add department failed. ', error.message)
    }
  }

  const handleUpdateData = async () => {
    try {
      console.log('dep=>' + formData.dep)
      formData.update_by = String(emailData)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/update`, formData)

      if (response.data.message === 'success') {
        console.log('Update department success.')
        handleClose()

        const index = tableData?.findIndex(x => x.dep == formData.dep)

        if (tableData) {
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

  const handleUpdateManyData = async () => {
    console.log('under construction...')

    const reqBody: any = {
      dep: [],
      path: formData.path
    }

    for (let elem of rowData) {
      reqBody.dep.push(elem.dep)
    }

    console.log('reqBody')
    console.log(reqBody)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/updateMany`, reqBody)

      if (response.data.message === 'success') {
        console.log('Update department success.')
        handleClose()
        updateDepartmentList()
      }
    } catch (error: any) {
      console.log('Update department failed. ', error.message)
    }
  }

  useEffect(() => {
    console.log('useEffect start')
    setFormData(updateData)
  }, [open, updateData])

  const getParentPath = (parentData: any) => {
    let path = ','

    if (tableData?.length) {
      const index = tableData?.findIndex(x => x.dep == String(parentData))

      if (index > 0) {
        path = tableData[Number(index)].path
      }
    }

    return { path: path }
  }

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
        {mode == 'insert-one' && <Typography variant='h5'>Add New Department</Typography>}
        {mode == 'insert-many' && <Typography variant='h5'>Add New Departments</Typography>}
        {mode == 'update-one' && <Typography variant='h5'>Edit Department</Typography>}
        {mode == 'update-many' && <Typography variant='h5'>Edit Departments</Typography>}
        {mode == 'delete-many' && <Typography variant='h5'>Delete Departments</Typography>}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          {(mode == 'insert-one' || mode == 'update-one') && (
            <>
              {/* Edit Department */}
              <CustomTextField
                select
                fullWidth
                id='select-department'
                value={formData.parent}
                onChange={e =>
                  setFormData({
                    ...formData,
                    parent: e.target.value,
                    path: getParentPath(e.target.value).path + e.target.value + ','
                  })
                }
                label='Select Parent'
              >
                <MenuItem value=''>Select Parent</MenuItem>
                {tableData?.map((parentData: any) => {
                  return (
                    <MenuItem key={parentData.dep} value={parentData.dep}>
                      {parentData.depname}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
              {errors.find(error => error.for === 'parent')?.message}
              <CustomTextField
                label='Department Name'
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
              {errors.find(error => error.for === 'sort')?.message}
              <CustomTextField
                label='Ref'
                fullWidth
                placeholder=''
                value={formData.ref}
                onChange={e => setFormData({ ...formData, sort: parseInt(e.target.value) })}
              />
            </>
          )}

          {mode == 'insert-many' && (
            <>
              {/* Add New Department */}
              <CustomTextField
                select
                fullWidth
                id='select-department'
                value={insertData.parent}
                onChange={e =>
                  setInsertData({
                    ...insertData,
                    parent: e.target.value,
                    path: getParentPath(e.target.value).path + e.target.value + ','
                  })
                }
                label='Select Parent'
              >
                <MenuItem value=''>Select Parent</MenuItem>
                {tableData?.map((parentData: any) => {
                  return (
                    <MenuItem key={parentData.dep} value={parentData.dep}>
                      {parentData.depname}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
              {errors.find(error => error.for === 'parent')?.message}
              <CustomTextField
                rows={16}
                multiline
                label='Department Name'
                InputLabelProps={{
                  shrink: true
                }}
                placeholder='Enter your department name'
                onChange={e => setInsertData({ ...insertData, depname: e.target.value })}
              />
            </>
          )}

          {mode == 'update-many' && (
            <>
              <div className='flex flex-col'>
                <label className=' text-xs flex-1 '>Department list</label>
                <List>
                  {rowData?.map((row: any, index: any) => {
                    return (
                      <div key={index}>
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemText primary={`${row.depname}`} />
                            {/* <ListItemText primary={`${row.depname}`} secondary={row.email} /> */}
                          </ListItemButton>
                        </ListItem>
                        <Divider className='m-0' />
                      </div>
                    )
                  })}
                </List>
              </div>

              {/* Edit Department */}
              <CustomTextField
                select
                fullWidth
                id='select-department'
                value={formData.parent}
                onChange={e =>
                  setFormData({
                    ...formData,
                    parent: e.target.value,
                    path: getParentPath(e.target.value).path + e.target.value + ','
                  })
                }
                label='Select Parent'
              >
                <MenuItem value=''>Select Parent</MenuItem>
                {tableData?.map((parentData: any) => {
                  return (
                    <MenuItem key={parentData.dep} value={parentData.dep}>
                      {parentData.depname}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
              {errors.find(error => error.for === 'parent')?.message}

              <CustomTextField
                label='Path'
                fullWidth
                disabled
                placeholder=''
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
              />
              {errors.find(error => error.for === 'path')?.message}
            </>
          )}
          {mode == 'delete-many' && <Typography>Delete many under construction...</Typography>}

          <div className='flex items-center gap-4'>
            {mode == 'insert-one' && (
              <Button variant='contained' type='submit'>
                Insert One
              </Button>
            )}

            {mode == 'insert-many' && (
              <Button variant='contained' onClick={() => handleInsertMany()} type='button'>
                Insert Many
              </Button>
            )}
            {mode == 'update-one' && (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Edit One
              </Button>
            )}
            {mode == 'update-many' && (
              <Button variant='tonal' onClick={() => handleUpdateManyData()}>
                Edit Many
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
