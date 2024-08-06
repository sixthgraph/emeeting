import Grid from '@mui/material/Grid'

// Type Imports
import type { StateinfosType } from '@/types/apps/stateinfoTypes'

// Component Imports
import StateListTable from './StateinfoListTable'

const StateinfoList = ({ stateinfoData }: { stateinfoData?: StateinfosType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StateListTable tableData={stateinfoData} />
      </Grid>
    </Grid>
  )
}

export default StateinfoList
