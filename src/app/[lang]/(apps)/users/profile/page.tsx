// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid'

// Type Imports

// Component Imports
import UserLeftOverview from '@views/apps/user/profile/user-left-overview'
import UserRight from '@views/apps/user/profile/user-right'

import type { PricingPlanType } from '@/types/pages/pricingTypes'

const OverViewTab = dynamic(() => import('@views/apps/user/profile/user-right/overview'))
const SecurityTab = dynamic(() => import('@views/apps/user/profile/user-right/security'))
const BillingPlans = dynamic(() => import('@views/apps/user/profile/user-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/user/profile/user-right/notifications'))
const ConnectionsTab = dynamic(() => import('@views/apps/user/profile/user-right/connections'))

// Vars
const tabContentList = (data: PricingPlanType[]): { [key: string]: ReactElement } => ({
  overview: <OverViewTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlans data={data} />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const getPricingData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/pricing`)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const UserViewTab = async () => {
  // Vars
  const data = await getPricingData()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserLeftOverview />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRight tabContentList={tabContentList(data)} />
      </Grid>
    </Grid>
  )
}

export default UserViewTab
