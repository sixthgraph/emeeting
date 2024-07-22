import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  //console.log('server token ==', token)

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getposition`, { headers })

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
