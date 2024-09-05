import Grid from '@mui/material/Grid'

import type { DepType, PositionFilterType, PositionsDepType } from '@/types/apps/positionTypes'

// Component Imports
import PositionDepListTable from './PositionDepListTable'

const PositionDepList = ({
  positionDepData,
  positionData,
  depData,
  depId
}: {
  positionDepData?: PositionsDepType[]
  positionData?: PositionFilterType[]
  depData?: DepType[]
  depId?: any
}) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PositionDepListTable tableData={positionDepData} positionData={positionData} depData={depData} depId={depId} />
      </Grid>
    </Grid>
  )
}

export default PositionDepList
