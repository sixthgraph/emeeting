import { NextRequest, NextResponse } from 'next/server'

import axios from '@/utils/axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { workflowid, token } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const response = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/workflow/${workflowid}`, {
      headers
    })
    const resData = response?.data

    return NextResponse.json(resData)
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
