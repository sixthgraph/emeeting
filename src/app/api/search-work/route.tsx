import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import axios from '@/utils/axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { queryData, token } = reqBody

  const text: any = queryData.Text

  const textStr = decodeURIComponent(text)

  queryData.Text = textStr

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const response = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/searchwork`, queryData, { headers })
    const resData = response?.data

    return NextResponse.json(resData)
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
