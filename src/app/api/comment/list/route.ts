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

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getmycomment?id=${email}`, { headers })
    const commentData = await response.json()

    if (commentData.message === 'success') {
      return NextResponse.json(commentData.data.detail)
    } else {
      const NotFoundData: any = []

      return NextResponse.json(NotFoundData)
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
