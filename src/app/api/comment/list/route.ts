import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token
  const email = serverSession?.user.email

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'no-store'
    }

    console.log()

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getmycomment?id=${email}`, {
      headers
    })

    const commentData = await response.json()

    const data = {
      commentdata: commentData.data.detail
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
