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

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}`, { headers })

    const todoData = await response.json()

    if (todoData.message === 'success') {
      return NextResponse.json(todoData.data.detail)
    } else {
      const NotFoundData: any = []

      return NextResponse.json(NotFoundData)
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
