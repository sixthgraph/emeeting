// import type { NextRequest } from 'next/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

//import { headers } from 'next/headers'

import axios from 'axios'

import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

// export async function GET() {

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  const serverSession = await getServerSession(options)
  const token2 = serverSession?.user.token

  console.log('server token2 ==', token2)

  //TOKEN FOR SEND HEADER TO ROUTEFLOW API
  // console.log('token =====')
  // console.log(token)

  try {
    // CALL ROUTEFLOW-API WITH AXIOS
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const roleres = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getuserrole`, { headers })
    const depres = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getdepartment`, { headers })
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getuserinfo`, { headers })

    if (roleres.data.message === 'success') {
      response.data.data.roles = roleres.data.data.detail
    }

    if (depres.data.message === 'success') {
      response.data.data.deps = depres.data.data.detail
    }

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
