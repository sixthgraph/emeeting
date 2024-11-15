// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
//import type { UsersType } from '@/types/apps/userTypes'
import type { TodoType } from '@/types/apps/todoTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import type { MyrequestType } from '@/types/apps/myrequestTypes'

const TableFilters = ({ setData, tableData }: { setData: any; tableData?: MyrequestType[] }) => {
  const [department, setDepartment] = useState<TodoType['currentdept']>('')
  const [route, setRoute] = useState('')
  const myDep: any = []
  const myRoute: any = []

  useEffect(() => {
    const filteredData = tableData?.filter(todo => {
      if (department && todo.currentdept !== department) return false
      if (route && todo.workflowid !== route) return false

      return true
    })

    setData(filteredData)
  }, [department, route, tableData, setData])

  tableData?.map(myReq => {
    const haveDep = myDep.find((item: any) => {
      return item.dep == myReq.currentdept
    })

    if (haveDep == undefined) {
      const newData = {
        dep: myReq.currentdept,
        depname: myReq.currentdeptname
      }

      myDep.push(newData)
    }
  })

  tableData?.map(todo => {
    const haveRoute = myRoute.find((item: any) => {
      return item.workflowid == todo.workflowid
    })

    if (haveRoute == undefined) {
      const newData = {
        workflowid: todo.workflowid,
        routename: todo.routename
      }

      myRoute.push(newData)
    }
  })

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
            {myDep?.map((dep: any, index: any) => (
              <MenuItem key={index} value={dep.dep}>
                {dep.depname}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <CustomTextField
            select
            fullWidth
            id='select-routeflow'
            value={route}
            onChange={e => setRoute(e.target.value)}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Select Application</MenuItem>
            {myRoute?.map((route: any, index: any) => (
              <MenuItem key={index} value={route.workflowid}>
                {route.routename}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
