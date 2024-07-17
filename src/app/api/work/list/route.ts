// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { wid, dep, token, email, workflowid, blockid } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const res = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}&dep=${dep}&wid=${wid}`, {
      headers
    })

    const workinfo = res.data.data.detail

    const resnp = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/getnextprocess/${workflowid}/${blockid}`, {
      headers
    })

    const response = NextResponse.json({
      message: res.data.message,
      success: true,
      data: workinfo,
      conditionData: resnp.data
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
