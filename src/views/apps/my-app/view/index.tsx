import Grid from '@mui/material/Grid'

import ViewAppControl from './ViewAppControl'

const ViewAppList = (data: any) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ViewAppControl appData={data} />
      </Grid>
    </Grid>
  )
}

export default ViewAppList
