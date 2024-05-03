// import type { NextRequest } from 'next/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

// import { headers } from 'next/headers'

import { getServerSession } from 'next-auth'

import { options } from './../auth/[...nextauth]/options'

// export async function GET() {
export async function POST(req: NextRequest) {
  const serverSession = await getServerSession(options)

  console.log('test server session =========> ')
  console.log(serverSession)

  const reqBody = await req.json()
  const { token } = reqBody

  //TOKEN FOR SEND HEADER TO ROUTEFLOW API
  console.log('token =====')
  console.log(token)

  try {
    /**
    // CALL ROUTEFLOW-API WITH FECTH HEADER
    const response = await fetch(`https://rd.infoma.net/routeflow-api/getuserinfo`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'force-cache'
    })

    */

    //**

    // CALL ROUTEFLOW-API WITH AXIOS
    const headers = { Authorization: `Bearer ${token}` }
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getuserinfo`, { headers })

    //*/

    console.log('get data success. ========> return : ', response.data)

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
