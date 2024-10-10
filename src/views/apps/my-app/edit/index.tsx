import Grid from '@mui/material/Grid'

import EditAppControl from './EditAppControl'

const EditAppList = (data: any) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <EditAppControl appData={data} />
      </Grid>
    </Grid>
  )
}

export default EditAppList
