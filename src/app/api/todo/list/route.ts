import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const response = await fetch(
      `${process.env.ROUTE_FLOW_API_URL}/getworklist?id=webmaster@excelink.co.th&dep=66165612ac85b486211bdcc7`,
      { headers }
    )

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
