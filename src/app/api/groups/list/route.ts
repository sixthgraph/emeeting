import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  // const reqBody = { token: session?.user.token }
  // const token = session?.user.token

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getusergroup`, { headers })

    console.log('getusergroup return')
    console.log(response.data)

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'no-store'
    }

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getusergroup`, {
      headers
    })

    const groupListData = await response.json()

    console.log('groupListData ===')
    console.log(groupListData)

    // const data = {
    //   commentdata: commentData.data.detail
    // }

    return NextResponse.json(groupListData.data.detail)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
