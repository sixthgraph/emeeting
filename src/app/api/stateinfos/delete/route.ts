// import type { NextRequest } from 'next/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

//mport axios from 'axios'

// import { headers } from 'next/headers'

import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  const reqBody = await req.json()
  console.log('reqBody ======')
  console.log(reqBody)
  //const { formData } = reqBody

  try {
    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/deletestateinfo?id=${reqBody.statecode}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'force-cache'
      }
    })

    const data = await response.json()

    console.log('server response')
    console.log(data)

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
