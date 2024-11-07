import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token, email } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getsendwork?id=${email}`, { headers })
    const sentData = await response.json()

    return NextResponse.json(sentData.data)
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
