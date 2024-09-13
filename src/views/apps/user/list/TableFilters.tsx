// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, tableData, depData }: { setData: any; tableData?: UsersType[]; depData?: any }) => {
  // States
  const [role, setRole] = useState<UsersType['role']>('')

  //const [plan, setPlan] = useState<UsersType['currentPlan']>('')
  const [status, setStatus] = useState<UsersType['status']>('')
  const [department, setDepartment] = useState('')
  const [position, setPosition] = useState('')

  const [selectData, setSelectData] = useState(tableData)

  const positionData: any = []

  if (selectData) {
    for (const elem of selectData) {
      const posObj: any = elem.dep

      for (const elm of posObj) {
        const postObj: any = elm

        if (postObj.positionid) {
          const check = positionData.find((item: any) => item.positionid == postObj.positionid)

          if (check == undefined) {
            const newData = {
              positionid: postObj.positionid,
              positionname: postObj.positionname
            }

            positionData.push(newData)
          }
        }
      }
    }
  }

  console.log('positionData')
  console.log(positionData)

  useEffect(() => {
    const filteredData = tableData?.filter((user: any) => {
      if (role && String(user.role) !== role) return false

      if (status && user.status !== status) return false

      const foundUser = user.dep.filter((userdep: any) => {
        return userdep.depid == department
      })

      if (department !== '' && foundUser == 0) return false

      const foundPos = user.dep.filter((userdep: any) => {
        return userdep.positionid == position
      })

      if (position !== '' && foundPos == 0) return false

      return true
    })

    setData(filteredData)
    setSelectData(filteredData)
  }, [role, status, department, position, tableData, setData])

  useEffect(() => {
    setPosition('')
  }, [department])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-department'
            value={department}
            onChange={e => setDepartment(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Department</MenuItem>
            {depData.map((dep: any, index: any) => {
              return (
                <MenuItem key={index} value={dep.dep}>
                  {dep.depname}
                </MenuItem>
              )
            })}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-position'
            value={position}
            onChange={e => setPosition(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Position</MenuItem>
            {positionData.map((pos: any, index: any) => {
              return (
                <MenuItem key={index} value={pos.positionid}>
                  {pos.positionname}
                </MenuItem>
              )
            })}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            value={role}
            onChange={e => setRole(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Role</MenuItem>
            {/* <MenuItem value='0'>Undefined</MenuItem> */}
            <MenuItem value='1'>Admin</MenuItem>
            <MenuItem value='2'>Worker</MenuItem>
            <MenuItem value='3'>Viewer</MenuItem>
            <MenuItem value='4'>Super User</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Status</MenuItem>
            <MenuItem value='pending'>Pending</MenuItem>
            <MenuItem value='active'>Active</MenuItem>
            <MenuItem value='inactive'>Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
