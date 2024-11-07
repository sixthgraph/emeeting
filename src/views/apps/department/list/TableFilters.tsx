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

const TableFilters = ({
  setData,
  tableData,
  depData
}: {
  setData: any
  tableData?: DepartmentsType[]
  depData?: DepartmentsType[]
}) => {
  // States

  const [statecode, setStatecode] = useState<DepartmentsType['statecode']>('')
  const [parent, setParent] = useState<DepartmentsType['parent']>('')

  useEffect(() => {
    const filteredData = tableData?.filter(department => {
      //if (role && String(user.role) !== role) return false

      //if (status && user.status !== status) return false
      if (statecode && department.statecode !== statecode) return false

      if (parent && department.parent !== parent) return false

      return true
    })

    setData(filteredData)
  }, [parent, statecode, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-parentdep'
            value={parent}
            onChange={e => setParent(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Parent</MenuItem>
            {depData?.map((depParent: any) => {
              return (
                <MenuItem key={depParent.dep} value={depParent.dep}>
                  {depParent.depname}
                </MenuItem>
              )
            })}
            {/* <MenuItem value='665421d5cf450c9ba79c2e26'>ECL</MenuItem>
            <MenuItem value='66542134cf450c9ba79c2e23'>RD</MenuItem> */}
          </CustomTextField>
        </Grid>
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
