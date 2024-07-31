import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'

import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  const headers = {
    Authorization: `Bearer ${token}`,
    cache: 'force-cache'
  }

  try {
    const reqBody = await request.json()

    console.log('sendback reqbody---')
    console.log(reqBody)

    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/sendback`, reqBody, { headers })
    const sent = res.data.data.detail

    const response = NextResponse.json({
      message: 'Send back work successful',
      success: true,
      data: sent
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
