import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

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

    console.log('reqBody === ')
    console.log(JSON.stringify(reqBody))

    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createworkinfo`, reqBody, { headers })

    console.log('ressssss ----')
    console.log(res.data)
    const work = res.data.data.detail

    const response = NextResponse.json({
      message: 'success',
      success: true,
      data: work
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
