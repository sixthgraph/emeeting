import Grid from '@mui/material/Grid'

import MyAppListTable from './MyAppListTable'

const MyAppList = (data: any) => {
  const tabledata = data

  // console.log('data4')
  // console.log(tabledata)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MyAppListTable tableData={tabledata} />
      </Grid>
    </Grid>
  )
}

export default MyAppList
