// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { wid, dep, token, email } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    console.log('get work list api url')
    console.log(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}&dep=${dep}&wid=${wid}`)

    //const res = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}&dep=${dep}&wid=${wid}`, {
    const res = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}&dep=${dep}&wid=${wid}`, {
      headers
    })

    console.log('getworklist return-------------------')
    console.log(res.data.data.detail)
    const workinfo = res.data.data.detail

    const response = NextResponse.json({
      message: res.data.message,
      success: true,
      data: workinfo
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
