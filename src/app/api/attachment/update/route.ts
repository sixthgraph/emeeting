import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token
  const reqBody = await req.json()
  const today = new Date()

  const update: any = {
    uid: reqBody.uid,
    attachdate: today
  }

  try {
    const response = await fetch(
      `${process.env.ROUTE_FLOW_API_URL}/updateattachment?wid=${reqBody.wid}&uid=${reqBody.uid}&dep=${reqBody.dep}&id=${reqBody.itemno}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          cache: 'force-cache'
        },
        body: JSON.stringify(update)
      }
    )

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
