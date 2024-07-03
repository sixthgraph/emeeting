import Grid from '@mui/material/Grid'

// Type Imports
import type { DepartmentsType, StateinfoType, DepParentType } from '@/types/apps/departmentTypes'

// Component Imports
import DepartmentListTable from './DepartmentListTable'

const DepartmentList = ({
  departmentData,
  stateinfoData,
  depParentData
}: {
  departmentData?: DepartmentsType[]
  stateinfoData?: StateinfoType[]
  depParentData?: DepParentType[]
}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DepartmentListTable tableData={departmentData} stateinfoData={stateinfoData} depParentData={depParentData} />
      </Grid>
    </Grid>
  )
}

export default DepartmentList
