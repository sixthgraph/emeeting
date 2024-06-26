// Next Imports

import { NextResponse } from 'next/server'

import axios from 'axios'

import { getServerSession } from 'next-auth'

import { options } from '../auth/[...nextauth]/options'

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const res = await axios.get(
      `${process.env.ROUTE_FLOW_API_URL}/getworklist?id=webmaster@excelink.co.th&dep=66165612ac85b486211bdcc7`,
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
