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

<<<<<<< HEAD
=======
  //const { formData } = reqBody

  console.log('server token =====')
  console.log(token)
  console.log('reqBody ======')
  console.log(reqBody)
  console.log(reqBody.GroupId)
  console.log('call routeflow-api =====')
  console.log(`https://rd.infoma.net/routeflow-api/deleteusergroup?id=${reqBody.GroupId}`)

>>>>>>> e02bdf0 (display member)
  try {
    const response = await fetch(`https://rd.infoma.net/routeflow-api/deleteusergroup?id=${reqBody.GroupId}`, {
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
