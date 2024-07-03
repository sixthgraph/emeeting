import Grid from '@mui/material/Grid'

// Type Imports
import type { PositionsType } from '@/types/apps/positionTypes'

// Component Imports
import PositionListTable from './PositionListTable'

const PositionList = ({ positionData }: { positionData?: PositionsType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PositionListTable tableData={positionData} />
      </Grid>
    </Grid>
  )
}

export default PositionList
