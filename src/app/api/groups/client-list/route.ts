import { NextResponse } from 'next/server'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'

export async function POST() {
  const serverSession = await getServerSession(options)
  const serverToken = serverSession?.user.token

  try {
    const headers = {
      Authorization: `Bearer ${serverToken}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getusergroup`, { headers })

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
