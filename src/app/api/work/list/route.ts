// Next Imports
//import type { NextRequest } from 'next/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

// Data Imports
//import { db } from '@/app/api/fake-db/user-profile'
import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()

  const { token, wid } = reqBody

  const serverSession = await getServerSession(options)
  const token2 = serverSession?.user.token

  console.log('server token2 ==', token2)

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const res = await axios.get(
      `${process.env.ROUTE_FLOW_API_URL}/getworklist?id=webmaster@excelink.co.th&dep=66165612ac85b486211bdcc7&wid=${wid}`,
      { headers }
    )

    console.log('getworklist return-------------------')
    console.log(res)
    const workinfo = res.data.data.detail

    const response = NextResponse.json({
      message: res.data.message,
      success: true,
      data: workinfo
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
