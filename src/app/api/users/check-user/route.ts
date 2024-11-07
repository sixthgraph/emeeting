import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()

    const res = await axios.post('https://rd.infoma.net/routeflow-api/login', reqBody)
    const user = res.data.data.detail

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      data: user
    })

    return response
  } catch (error: any) {
    const response = NextResponse.json({
      message: 'Login Failed',
      success: false
    })

    return response
  }
}
