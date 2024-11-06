import { NextResponse, type NextRequest } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token, email } = reqBody

  try {
    // CALL ROUTEFLOW-API WITH AXIOS
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    console.log('refresh token to ====')
    console.log(`${process.env.ROUTE_FLOW_API_URL}/refreshtoken`)

    const response = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/refreshtoken`, { email: email }, { headers })

    console.log('refresh token response')
    console.log(response)

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
