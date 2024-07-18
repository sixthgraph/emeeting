import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'

import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  try {
    const serverSession = await getServerSession(options)
    const token = serverSession?.user.token

    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const reqBody = await request.json()

    console.log(`${process.env.ROUTE_FLOW_API_URL}/sendwork`)
    console.log(reqBody)
    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/sendwork`, reqBody, { headers })
    const sent = res.data.data.detail

    console.log('----res send-----')
    console.log(res)

    const response = NextResponse.json({
      message: 'Send work successful',
      success: true,
      data: sent
    })

    return response
  } catch (error: any) {
    console.log('----res send-----')
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
