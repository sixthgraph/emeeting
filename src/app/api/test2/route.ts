import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from './../auth/[...nextauth]/options'

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getuserinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'force-cache'
      }
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
