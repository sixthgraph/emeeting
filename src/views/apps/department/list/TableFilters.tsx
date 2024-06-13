// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { DepartmentsType } from '@/types/apps/departmentTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, tableData }: { setData: any; tableData?: DepartmentsType[] }) => {
  // States
  //const [role, setRole] = useState<UsersType['role']>('')

  //const [status, setStatus] = useState<UsersType['status']>('')

  // console.log('tableData === >', tableData)

  const [statecode, setStatecode] = useState<DepartmentsType['statecode']>('')

  useEffect(() => {
    const filteredData = tableData?.filter(department => {
      //if (role && String(user.role) !== role) return false

      //if (status && user.status !== status) return false
      if (statecode && department.statecode !== statecode) return false

      return true
    })

    setData(filteredData)
  }, [statecode, tableData, setData])

  return (
    //<div>Filter Here</div>
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-stateinfo'
            value={statecode}
            onChange={e => setStatecode(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select State</MenuItem>
            <MenuItem value='01'>ปกติ</MenuItem>
            <MenuItem value='02'>ห้ามใช้</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
