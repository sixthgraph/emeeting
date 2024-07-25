// React Imports
import { useState } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports

import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'

import type { DepType, PositionDepFormDataType, PositionFilterType, PositionsDepType } from '@/types/apps/positionTypes'

type Props = {
  open: boolean
  updateData: PositionDepFormDataType
  setData: any
  tableData?: PositionsDepType[]
  depData?: DepType[]
  positionData?: PositionFilterType[]
  handleClose: () => void
}

// Vars
const initialData = {
  dep: '',
  depname: '',
  path: '',
  sort: '',
  ref: '',
  positioncode: '',
  positiondesc: '',
  positionpath: '',
  positionlevel: '',
  positionref: '',
  positionparent: '',
  depparent: ''
}

const PositionDepDrawerForm = ({ open, setData, updateData, tableData, depData, positionData, handleClose }: Props) => {
  //const router = useRouter()
  //const params = useParams()
  //const { lang: locale } = params

  // States
  const [formData, setFormData] = useState<PositionDepFormDataType>(initialData)

  //const [errors, setErrors] = useState<any[]>([])

  // setErrors([])

  const errors: any[] = []

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormData(initialData)

    //Add
    try {
      //formdata for add
      const positionlevel = parseInt(formData.positionlevel, 10)

      const newData: any = {
        dep: formData.dep,
        positioncode: formData.positioncode,
        level: positionlevel,
        path: formData.positionpath
      }

      // const parsedData = addPositionDepFormSchema.safeParse(newData)

      // if (!parsedData.success) {
      //   const errArr: any[] = []
      //   const { errors: err } = parsedData.error

      //   //sg here
      //   for (let i = 0; i < err.length; i++) {
      //     errArr.push({ for: err[i].path[0], message: err[i].message })
      //     setErrors(errArr)
      //   }

      //   setErrors(errArr)

      //   throw err
      // }

      // console.log('Form submitted successfully', parsedData.data)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/positions/add`, newData)

      console.log('Add response===', response.data)

      if (response.data.success) {
        console.log('Add success')

        // if (tableData) {
        //   const addData: any = {
        //     dep: formData.dep,
        //     positioncode: formData.positioncode,
        //     positiondesc: formData.positiondesc,
        //     positionlevel: formData.positionlevel,
        //     positionpath: formData.positionpath,
        //     positionref: formData.ref
        //   }

        //   console.log(addData)

        //   //tableData.push(addData)
        //   tableData.push(addData)
        // }

        // console.log(tableData)

        // setData(tableData)
        handleClose()
        handleRefresh()
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

  //Update
  const handleUpdateData = async () => {
    try {
      const positionlevel = parseInt(formData.positionlevel, 10)

      const newData: any = {
        dep: formData.dep,
        positioncode: formData.positioncode,
        level: positionlevel,
        path: formData.positionpath
      }

      const response = await axios.post('/api/departments/positions/update', newData)

      console.log('position formdate=====')
      console.log(formData)
      console.log(response.data)

      if (response.data.message === 'success') {
        console.log('Update position success.')
        handleClose()

        const index = tableData?.findIndex(x => x.positioncode == formData.positioncode)

        if (tableData) {
          //const newUpdate = { ...tableData[Number(foundIndex)], formData }
          // tableData[Number(index)].password = formData.password
          //tableData[Number(index)]
          tableData[Number(index)].dep = formData.dep
          tableData[Number(index)].depname = formData.depname
          tableData[Number(index)].positioncode = formData.positioncode
          tableData[Number(index)].positiondesc = formData.positiondesc
          tableData[Number(index)].positionpath = formData.positionpath
          tableData[Number(index)].positionlevel = formData.positionlevel
          tableData[Number(index)].positionref = formData.positionref
        }

        setData(tableData)
      }
    } catch (error: any) {
      console.log('Update Position failed. ', error.message)
    }
  }

  // useEffect(() => {
  //   setFormData(updateData)
  // }, [open, updateData])

  const getParentPositionPath = (parentData: any) => {
    let path = ''
    let level = '1'

    if (tableData?.length) {
      const index = tableData?.findIndex(x => x.positioncode == String(parentData))

      path = tableData[Number(index)].positionpath
      level = tableData[Number(index)].positionlevel + 1
    }

    return { path: path, level: level }
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
        {updateData.positioncode !== '' ? (
          <Typography variant='h5'>Edit Position</Typography>
        ) : (
          <Typography variant='h5'>Add New Position</Typography>
        )}
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            label='Dep'
            fullWidth
            placeholder=''
            value={formData.dep}
            onChange={e => setFormData({ ...formData, dep: e.target.value })}
          />
          {errors.find(error => error.for === 'dep')?.message}
          <CustomTextField
            label='Dep Path'
            fullWidth
            placeholder=''
            value={formData.path}
            onChange={e => setFormData({ ...formData, path: e.target.value })}
          />
          {errors.find(error => error.for === 'path')?.message}
          <CustomTextField
            select
            fullWidth
            id='select-dep-parent'
            value={formData.depparent}
            onChange={e => setFormData({ ...formData, depparent: e.target.value })}
            label='Department Position Parent'
          >
            {depData?.map((depParent: any) => {
              return (
                <MenuItem key={depParent.dep} value={depParent.dep}>
                  {depParent.depname}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'positioncode')?.message}
          <CustomTextField
            select
            fullWidth
            id='select-parent'
            value={formData.positionparent}
            onChange={e =>
              setFormData({
                ...formData,
                positionparent: e.target.value,
                positionpath: getParentPositionPath(e.target.value).path + e.target.value + ',',
                positionlevel: getParentPositionPath(e.target.value).level
              })
            }
            label='Position Parent'
          >
            {positionData?.map((parent: any) => {
              return (
                <MenuItem key={parent.positioncode} value={parent.positioncode}>
                  {parent.desc}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'positioncode')?.message}
          {/* <CustomTextField
            label='Position Parent'
            fullWidth
            placeholder=''
            value={formData.positionparent}
            onChange={e => setFormData({ ...formData, positionparent: e.target.value })}
          />
          {errors.find(error => error.for === 'positionparent')?.message} */}
          <CustomTextField
            select
            fullWidth
            id='select-position'
            value={formData.positioncode}
            onChange={e => setFormData({ ...formData, positioncode: e.target.value })}
            label='Position'
          >
            {positionData?.map((position: any) => {
              return (
                <MenuItem key={position.positioncode} value={position.positioncode}>
                  {position.desc}
                </MenuItem>
              )
            })}
          </CustomTextField>
          {errors.find(error => error.for === 'positioncode')?.message}
          {/* <CustomTextField
            label='Positioncode'
            fullWidth
            placeholder=''
            value={formData.positioncode}
            onChange={e => setFormData({ ...formData, positioncode: e.target.value })}
          />
          {errors.find(error => error.for === 'positioncode')?.message} */}
          <CustomTextField
            label='level'
            fullWidth
            placeholder=''
            value={formData.positionlevel}
            onChange={e => setFormData({ ...formData, positionlevel: e.target.value })}
          />
          {errors.find(error => error.for === 'positionlevel')?.message}
          {/* <CustomTextField
            label='Path'
            fullWidth
            placeholder=''
            value={formData.positionpath}
            onChange={e => setFormData({ ...formData, positionpath: e.target.value })}
          />
          {errors.find(error => error.for === 'positionpath')?.message} */}
          <div className='flex items-center gap-4'>
            {updateData.positioncode !== '' ? (
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

export default PositionDepDrawerForm
