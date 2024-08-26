import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()

  const { token, wid, itemno } = reqBody

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }

    const res = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getattachment?wid=${wid}&id=${itemno}`, {
      headers
    })

    const getattm_res = res.data

    console.log(wid)
    console.log(itemno)

    console.log('----- attm list-------------')
    console.log(res.data)

    if (getattm_res.message == 'success') {
      const response = NextResponse.json({
        message: 'success',
        success: true,
        data: getattm_res.data.detail
      })

      return response
    } else {
      return NextResponse.json({ error: getattm_res.message }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
