// React Imports
import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'

import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import type { SelectChangeEvent } from '@mui/material/Select'

// Component Imports

import axios from 'axios'

import { Chip } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

import type { DepType, PositionDepFormDataType, PositionFilterType } from '@/types/apps/positionTypes'

type Props = {
  open: boolean
  updateData: PositionDepFormDataType
  setData: any
  tableData?: any
  depData?: DepType[]
  positionData?: PositionFilterType[]
  handleClose: () => void
  updateDepPositionList: any
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

const PositionDepDrawerForm = ({
  open,
  setData,
  updateData,
  tableData,
  positionData,
  handleClose,
  updateDepPositionList
}: Props) => {
  // States
  const [formData, setFormData] = useState<PositionDepFormDataType>(initialData)
  const [positonName, setPositonName] = useState<string[]>([])

  console.log('tableData === ')
  console.log(tableData)
  console.log('setData')
  console.log(setData)

  const posObjData: any[] = []

  posObjData.push({
    positioncode: '',
    positiondesc: 'No Parent'
  })

  let i: any

  for (i in tableData) {
    let elem: any = []

    tableData && (elem = tableData[i])

    if (elem.positioncode !== updateData.positioncode) {
      posObjData.push({
        positioncode: elem.positioncode,
        positiondesc: elem.positiondesc
      })
    }
  }

  console.log('positionData')
  console.log(positionData)

  const havePosition = (pc: any) => {
    const result = tableData.find((item: any) => item.positioncode === pc)

    return result
  }

  const addPosObjData = positionData?.filter(item => {
    if (havePosition(item.positioncode) !== undefined) {
      return false
    }

    return true
  })

  console.log('addPosObjData')
  console.log(addPosObjData)

  useEffect(() => {
    setFormData(updateData)
    setPositonName([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  console.log('updateData ===')
  console.log(updateData)

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    console.log('event.target')
    console.log(event.target)
    setPositonName(event.target.value as string[])
    console.log('positonName')
    console.log(positonName)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const dataArr = positonName
    const updatePosData = []

    for (let i = 0; i < dataArr.length; i++) {
      const newData = {
        dep: updateData.dep,
        positioncode: dataArr[i],
        path: ',',
        level: 0
      }

      updatePosData.push(newData)
    }

    console.log('updatePosData === ')
    console.log(updatePosData)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/positions/add`, updatePosData)

      console.log('Add response===', response.data)

      if (response.data.success) {
        console.log('Add success')

        handleClose()
        console.log('Call updateDepPositionList')
        updateDepPositionList()
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
        updateDepPositionList()
      }
    } catch (error: any) {
      console.log('Update Position failed. ', error.message)
    }
  }

  const getParentPositionPath = (parentData: any) => {
    let path = ''
    let level = '1'

    if (parentData == '') {
      path = ''
      level = '0'
    } else if (tableData?.length) {
      const index = tableData?.findIndex((x: any) => x.positioncode == String(parentData))

      path = tableData[Number(index)]?.positionpath
      level = tableData[Number(index)]?.positionlevel + 1
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
          <Typography variant='h5'>Edit Position : {updateData.positiondesc}</Typography>
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
          {updateData.positioncode !== '' ? (
            <>
              <CustomTextField label='Department Name' fullWidth placeholder='' disabled value={formData.depname} />

              <CustomTextField
                select
                fullWidth
                id='select-position'
                value={formData.positioncode}
                disabled
                onChange={e => setFormData({ ...formData, positioncode: e.target.value })}
                label='Position Name'
              >
                {positionData?.map((position: any) => {
                  return (
                    <MenuItem key={position.positioncode} value={position.positioncode}>
                      {position.desc}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
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
                label='Select Parent'
              >
                {posObjData?.map((parent: any, index: any) => {
                  return (
                    <MenuItem key={index} value={parent.positioncode}>
                      {parent.positiondesc}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
              {/* <CustomTextField
              label='Position Parent'
              fullWidth
              placeholder=''
              value={formData.positionparent}
              onChange={e => setFormData({ ...formData, positionparent: e.target.value })}
            />
            {errors.find(error => error.for === 'positionparent')?.message} */}

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
                disabled
                placeholder=''
                value={formData.positionlevel}
                onChange={e => setFormData({ ...formData, positionlevel: e.target.value })}
              />
              <CustomTextField
                label='Path'
                fullWidth
                placeholder=''
                value={formData.positionpath}
                disabled
                onChange={e => setFormData({ ...formData, positionpath: e.target.value })}
              />
            </>
          ) : (
            <CustomTextField
              select
              fullWidth
              label='Select Position'
              value={positonName}
              id='select-position'
              SelectProps={{
                multiple: true, // @ts-ignore
                onChange: e => handleChange(e),
                renderValue: selected => (
                  <div className='flex flex-wrap gap-1'>
                    {(selected as unknown as string[]).map(value => (
                      <Chip key={value} label={value} size='small' />
                    ))}
                  </div>
                )
              }}
            >
              {addPosObjData?.map((position: any, index: any) => (
                <MenuItem key={index} value={position.positioncode}>
                  {position.desc}
                </MenuItem>
              ))}
            </CustomTextField>
          )}

          <div className='flex items-center gap-4'>
            {updateData.positioncode !== '' ? (
              <Button variant='tonal' onClick={() => handleUpdateData()}>
                Edit
              </Button>
            ) : (
              <Button variant='contained' onClick={() => handleSubmit} type='submit'>
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
