import Grid from '@mui/material/Grid'

// Type Imports
import type { DepType, PositionFilterType, PositionsDepType, PositionsType } from '@/types/apps/positionTypes'

// Component Imports
import PositionDepListTable from './PositionDepListTable'

const PositionDepList = ({
  positionDepData,
  positionData,
  depData
}: {
  positionDepData?: PositionsDepType[]
  positionData?: PositionFilterType[]
  depData?: DepType[]
}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PositionDepListTable tableData={positionDepData} positionData={positionData} depData={depData} />
      </Grid>
    </Grid>
  )
}

export default PositionDepList
