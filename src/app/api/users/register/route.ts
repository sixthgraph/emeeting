import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'

export async function POST(request: NextRequest) {
  console.log('start post register -----------------------')

  try {
    const reqBody = await request.json()

    console.log('reqBody =====', reqBody)

    // const res = await axios.post('http://localhost:9995/register', reqBody)
    const res = await axios.post('https://rd.infoma.net/routeflow-api/register', reqBody)
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
