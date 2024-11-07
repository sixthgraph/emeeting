import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const reqBody = await request.json()

    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/searchwork`, reqBody, { headers })

    const search_res = res.data

    if (search_res.message == 'success') {
      const response = NextResponse.json({
        message: 'success',
        success: true,
        data: search_res.data.detail
      })

      return response
    } else {
      return NextResponse.json({ error: search_res.message }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
