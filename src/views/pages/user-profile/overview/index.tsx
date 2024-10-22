// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
// import ActivityTimeline from '../profile/ActivityTimeline'
// import ConnectionsTeams from '../profile/ConnectionsTeams'
// import ProjectsTable from '../profile/ProjectsTables'
import UserActivityTimeLineV2 from './UserActivityTimeline'
import MyRouteListTableV2 from './MyRouteListTable'

const OverviewTab = ({ activityData, myRouteListData }: { activityData?: any; myRouteListData?: any }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <MyRouteListTableV2 routeData={myRouteListData} />
      </Grid>
      <Grid item xs={12}>
        <UserActivityTimeLineV2 data={activityData} />
      </Grid>

      {/* <Grid item xs={12}>
        <ActivityTimeline />
      </Grid>
      <Grid item xs={12}>
        <ProjectsTable projectTable={data?.projectTable} />
      </Grid> */}
    </Grid>
  )
}

export default OverviewTab
