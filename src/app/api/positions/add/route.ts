import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const reqBody = await request.json()

    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createposition`, reqBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'force-cache'
      }
    })

    const group = res.data.data.detail

    const response = NextResponse.json({
      message: 'Create successful',
      success: true,
      data: group
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
