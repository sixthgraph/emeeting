import Grid from '@mui/material/Grid'

// Type Imports
import type { DepartmentsType, StateinfoType } from '@/types/apps/departmentTypes'

// Component Imports
import DepartmentListTable from './DepartmentListTable'

const DepartmentList = ({
  departmentData,
  stateinfoData
}: {
  departmentData?: DepartmentsType[]
  stateinfoData?: StateinfoType[]
}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DepartmentListTable tableData={departmentData} stateinfoData={stateinfoData} />
      </Grid>
    </Grid>
  )
}

export default DepartmentList
