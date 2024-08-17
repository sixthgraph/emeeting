import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getdepartmentlist`, { headers })
    const stateinfores = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getstateinfo`, { headers })

    console.log('response.data.data')
    console.log(response.data.data)

    if (stateinfores.data.message === 'success') {
      response.data.data.stateinfos = stateinfores.data.data.detail
    }

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
