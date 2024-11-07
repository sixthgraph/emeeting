// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

//import { headers } from 'next/headers';

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token, email } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const res = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getmyroute?id=${email}`, {
      headers
    })

    let myRouteData = res.data.data.detail

    if (myRouteData === null || myRouteData === undefined) {
      myRouteData = []
    }

    const response2 = NextResponse.json({
      message: res.data.message,
      success: true,
      data: myRouteData
    })

    return response2
  } catch (error: any) {
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
