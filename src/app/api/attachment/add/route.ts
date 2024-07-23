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

    console.log(`${process.env.ROUTE_FLOW_API_URL}/createattachment`)
    console.log(reqBody)
    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createattachment`, reqBody, { headers })
    const attm = res.data.data.detail

    console.log('----res createattachment-----')
    console.log(res)

    const response = NextResponse.json({
      message: 'createattachment successful',
      success: true,
      data: attm
    })

    return response
  } catch (error: any) {
    console.log('----res send-----')
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
