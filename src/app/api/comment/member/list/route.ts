import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// import { getServerSession } from 'next-auth'

// import { options } from '@/app/api/auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  // const serverSession = await getServerSession(options)
  // const token = serverSession?.user.token
  const reqBody = await req.json()
  const { wid, token } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'no-store'
    }

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getchatmember/${wid}`, {
      headers
    })

    const memberData = await response.json()

    console.log('memberData route')
    console.log(memberData)

    return NextResponse.json(memberData)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
