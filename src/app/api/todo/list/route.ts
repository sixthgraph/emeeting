import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token
  const email = serverSession?.user.email

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    console.log('call getworklist url ====')
    console.log(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}&dep=test`)

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}&dep=""`, {
      headers
    })

    const depres = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getdepartment`, { headers })
    const todoData = await response.json()
    const depData = await depres.json()

    const data = {
      todo: todoData.data.detail,
      dep: depData.data.detail
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
