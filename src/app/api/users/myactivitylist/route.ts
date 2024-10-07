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

    console.log('getlatestactivity')
    console.log(`${process.env.ROUTE_FLOW_API_URL}/getlatestactivity?id=${email}`)

    const res = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getlatestactivity?id=${email}`, {
      headers
    })

    console.log('getlatestactivity')
    console.log(res.data)

    const myactivitydata = res.data.data.detail

    const response2 = NextResponse.json({
      message: res.data.message,
      success: true,
      data: myactivitydata
    })

    return response2
  } catch (error: any) {
    console.log('catch error')
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
