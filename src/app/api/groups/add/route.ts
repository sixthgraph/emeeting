import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()

    console.log('reqBody ==== ', reqBody)
    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createusergroup`, reqBody)
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
