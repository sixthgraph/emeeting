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

  console.log('tableData === >', tableData)
  console.log('depData222 === >', depData)

  useEffect(() => {
    const filteredData = tableData?.filter((user: any) => {
      if (role && String(user.role) !== role) return false

      if (status && user.status !== status) return false

      console.log('department == ')
      console.log(department)

      const foundUser = user.dep.filter((userdep: any) => {
        return userdep.depid == department
      })

      if (department !== '' && foundUser == 0) return false

      return true
    })

    //   setData(filteredData)
    // }, [role, plan, status, tableData, setData])

    setData(filteredData)
  }, [role, status, department, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
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
      </Grid>
    </CardContent>
  )
}

export default TableFilters
