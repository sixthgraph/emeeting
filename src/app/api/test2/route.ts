// import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

//mport axios from 'axios'

// import { headers } from 'next/headers'

import { getServerSession } from 'next-auth'

import { options } from './../auth/[...nextauth]/options'

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const response = await fetch(`https://rd.infoma.net/routeflow-api/getuserinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'force-cache'
      }
    })

    const data = await response.json()

    // const headers = { Authorization: `Bearer ${token}` }
    // const response = await axios.get('https://rd.infoma.net/routeflow-api/testgetuserinfo', { headers })

    console.log('server response')
    console.log(data)

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
