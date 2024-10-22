// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Type Imports
import type { ProfileTeamsType, ProfileCommonType, ProfileTabType } from '@/types/pages/profileTypes'

const renderList = (list: ProfileCommonType[]) => {
  return (
    list.length > 0 &&
    list.map((item, index) => {
      return (
        <div key={index} className='flex items-center gap-2'>
          <i className={item.icon} />
          <div className='flex items-center flex-wrap gap-2'>
            <Typography className='font-medium'>
              {`${item.property.charAt(0).toUpperCase() + item.property.slice(1)}:`}
            </Typography>
            <Typography> {item.value.charAt(0).toUpperCase() + item.value.slice(1)}</Typography>
          </div>
        </div>
      )
    })
  )
}

const renderTeams = (teams: ProfileTeamsType[]) => {
  return (
    teams.length > 0 &&
    teams.map((item, index) => {
      return (
        <div key={index} className='flex items-center flex-wrap gap-2'>
          <Typography className='font-medium'>
            {item.property.charAt(0).toUpperCase() + item.property.slice(1)}
          </Typography>
          <Typography>{item.value.charAt(0).toUpperCase() + item.value.slice(1)}</Typography>
        </div>
      )
    })
  )
}

const AboutOverview = ({ data, userData, myStat }: { data?: ProfileTabType; userData?: any; myStat?: any }) => {
  const roles = ['Admin', 'Worker', 'Viewer', 'Super User']

  const aboutData = [
    { property: 'Full Name', value: `${userData?.firstname} ${userData?.lastname}`, icon: 'tabler-user' },
    { property: 'Status', value: `${userData?.status}`, icon: 'tabler-check' },
    { property: 'Role', value: roles[Number(`${userData?.role}`) - 1], icon: 'tabler-crown' },
    { property: 'Country', value: 'TH', icon: 'tabler-flag' },
    { property: 'Language', value: 'English', icon: 'tabler-language' }
  ]

  const statData = [
    { property: 'Task Done', value: myStat?.complete, icon: 'tabler-checkbox' },
    { property: 'Task Total', value: myStat?.total, icon: 'tabler-briefcase' }
  ]

  console.log('data?.overview')
  console.log(data?.overview)
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                About
              </Typography>
              {userData && renderList(aboutData)}
            </div>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Contacts
              </Typography>
              {data?.contacts && renderList(data?.contacts)}
            </div>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Department
              </Typography>
              {userData?.dep.map((item: any, index: any) => (
                <div key={index} className='flex items-center gap-2'>
                  {item.depname} / {item.positionname}
                </div>
              ))}
            </div>
            {/* <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Teams
              </Typography>
              {data?.teams && renderTeams(data?.teams)}
            </div> */}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Overview
              </Typography>
              {myStat && renderList(statData)}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
