import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

// export async function GET() {
export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  try {
    // CALL ROUTEFLOW-API WITH AXIOS
    const headers = { Authorization: `Bearer ${token}` }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getuserinfo`, { headers })

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
