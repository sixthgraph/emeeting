import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token
  const email = serverSession?.user.email

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    console.log('call getmyitems url ====')
    console.log(`${process.env.ROUTE_FLOW_API_URL}/getmyrequest?id=${email}&dep=test`)

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getmyrequest?id=${email}`, { headers })
    const depres = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getdepartment`, { headers })
    const myrequestData = await response.json()
    const depData = await depres.json()

    const data = {
      myrequest: myrequestData.data.detail,
      dep: depData.data.detail
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
