// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
// import ProjectListTable from './ProjectListTable'
import UserActivityTimeLine from './UserActivityTimeline'
import MyRouteListTable from './MyRouteLIstTable'

// import InvoiceListTable from './InvoiceListTable'

// const getData = async () => {
//   const res = await fetch(`${process.env.API_URL}/pages/invoice`)

//   if (!res.ok) {
//     throw new Error('Failed to fetch invoice data')
//   }

//   return res.json()
// }

const OverViewTab = async ({ data, routeData }: { data: any; routeData?: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MyRouteListTable routeData={routeData} />
      </Grid>
      {/* <Grid item xs={12}>
        <ProjectListTable />
      </Grid> */}
      <Grid item xs={12}>
        <UserActivityTimeLine data={data} />
      </Grid>
      {/* <Grid item xs={12}>
        <InvoiceListTable invoiceData={invoiceData} />
      </Grid> */}
    </Grid>
  )
}

export default OverViewTab
