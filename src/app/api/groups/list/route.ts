import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  //console.log('server token ==', token)

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getusergroup`, { headers })
    const userinfo = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getuserinfo`, { headers })

    // console.log(response.data.data.detail)
    console.log(userinfo.data.data.detail)

    return NextResponse.json(response.data, userinfo.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
