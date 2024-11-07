import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getdepposition?id=${reqBody.dep}`, { headers })
    const positions = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getposition`, { headers })
    const departments = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getdepartment`, { headers })

    if (response.data.data.detail == null) response.data.data.detail = []

    if (positions.data.message === 'success') {
      response.data.data.positions = positions.data.data.detail
    }

    if (departments.data.message === 'success') {
      response.data.data.departments = departments.data.data.detail
    }

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
