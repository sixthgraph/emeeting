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

  //const { formData } = reqBody

  console.log('server token =====')
  console.log(token)
  console.log('call routeflow-api =====')
  console.log(`https://rd.infoma.net/routeflow-api/deleteuserinfo?id=${reqBody.email}`)

  try {
    const response = await fetch(`https://rd.infoma.net/routeflow-api/deleteuserinfo?id=${reqBody.email}`, {
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