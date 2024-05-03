import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/login`, reqBody)
    const user = res.data.data.detail

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      data: user
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
