// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
//import type { UsersType } from '@/types/apps/userTypes'
import type { TodoType } from '@/types/apps/todoTypes'
import type { DepType } from '@/types/apps/userTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({
  setData,
  tableData,
  depData
}: {
  setData: any
  tableData?: TodoType[]
  depData?: DepType[]
}) => {
  const [department, setDepartment] = useState<TodoType['basketid']>('')
  const myDep: any = []
  const depObj: DepType = {}

  depData?.map(dep => {
    const id = String(dep.dep)

    depObj[id] = {
      dep: String(dep.dep),
      depname: String(dep.depname),
      docuname: Number(dep.docuname),
      path: String(dep.path),
      sort: Number(dep.sort),
      statecode: String(dep.statecode)
    }
  })

  tableData?.map((todo, index) => {
    myDep[index] = {
      dep: depObj[todo.basketid].dep,
      depname: depObj[todo.basketid].depname,
      docuname: depObj[todo.basketid].docuname,
      path: depObj[todo.basketid].path,
      sort: depObj[todo.basketid].sort,
      statecode: depObj[todo.basketid].statecode
    }
  })

  useEffect(() => {
    const filteredData = tableData?.filter(todo => {
      if (department && todo.basketid[0] !== department) return false

      return true
    })

    setData(filteredData)
  }, [department, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
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
            {myDep?.map((dep: any) => (
              <MenuItem key={dep.dep} value={dep.dep}>
                {dep.depname}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
