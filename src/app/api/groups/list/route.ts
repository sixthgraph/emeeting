import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const session = await getServerSession(options)

  const reqBody = await req.json()
  const { token } = reqBody
  const serverToken = session?.user.token

  console.log('serverToken')
  console.log(serverToken)

  // const reqBody = { token: session?.user.token }
  // const token = session?.user.token

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getusergroup`, { headers })

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
