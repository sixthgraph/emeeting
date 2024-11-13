// MUI Imports
import Card from '@mui/material/Card'

// Component Imports
import CalendarWrapper from '@views/apps/calendar/CalendarWrapper'

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

async function fetchEvents() {
  console.log('555555')
  console.log(`${process.env.API_URL}/apps/calendar-events`)
  console.log(`${process.env.NEXT_PUBLIC_API_URL}/apps/calendar-events`)

  // Vars
  // const res = await fetch(`${process.env.API_URL}/apps/calendar-events`)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar-events`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const CalendarApp = async () => {
  // Vars
  //const res = (await fetchEvents()) || []

  const res = await fetchEvents()

  return (
    <Card className='overflow-visible'>
      <AppFullCalendar className='app-calendar'>
        <CalendarWrapper events={res.events} />
      </AppFullCalendar>
    </Card>
  )
}

export default CalendarApp
