// import type { NextRequest } from 'next/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

//mport axios from 'axios'

// import { headers } from 'next/headers'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  const reqBody = await req.json()

  try {
    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/deleteusers`, reqBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'force-cache'
      }
    })

    const deleteResult = res.data.data.detail

    const response = NextResponse.json({
      message: 'success',
      success: true,
      data: deleteResult
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.massage }, { status: 500 })
  }
}
