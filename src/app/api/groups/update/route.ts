import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { options } from './../../auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  const reqBody = await req.json()

  console.log('server token =====')
  console.log(token)
  console.log('reqBody =====')
  console.log(reqBody)

  try {
    const response = await fetch(`https://rd.infoma.net/routeflow-api/updateusergroup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'force-cache'
      },
      body: JSON.stringify(reqBody)
    })

    const data = await response.json()

    console.log('server response')
    console.log(data)

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
