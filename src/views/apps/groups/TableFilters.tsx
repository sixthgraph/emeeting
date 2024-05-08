// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
// import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { GroupType } from '@/types/apps/groupTypes'

const TableFilters = ({ setData, tableData }: { setData: any; tableData?: GroupType[] }) => {
  useEffect(() => {
    const filteredData = tableData?.filter(user => {})
    setData(filteredData)
  }, [tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-role'
            // value={role}
            // onChange={e => setRole(e.target.value)}
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
      </Grid>
    </CardContent>
  )
}

export default TableFilters
