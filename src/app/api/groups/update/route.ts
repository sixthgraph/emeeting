import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token
  const reqBody = await req.json()

  console.log('reqBody update=====')
  console.log(reqBody)
  console.log(reqBody.groupid)

  const updateData: any = {
    groupname: reqBody.groupname,
    createby: reqBody.createby,
    member: reqBody.member
  }

  console.log('updateData update=====')
  console.log(updateData)

  try {
    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/updateusergroup?id=${reqBody.groupid}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        cache: 'force-cache'
      },
      body: JSON.stringify(updateData)
    })

    console.log('noon reqBody')
    console.log(JSON.stringify(reqBody))
    console.log('noon updateData')
    console.log(JSON.stringify(updateData))

    const data = await response.json()

    console.log('server response')
    console.log(data)

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
