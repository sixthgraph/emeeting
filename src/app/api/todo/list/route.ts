import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from './../../auth/[...nextauth]/options'

export async function GET() {
  console.log('todo route start method GET')
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token
  const email = serverSession?.user.email

  console.log('token from todo route ====')
  console.log(token)

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'no-store'
    }

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}`, {
      headers
    })

    // const depres = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getdepartment`, { headers })
    const todoData = await response.json()

    // const depData = await depres.json()

    const data = {
      todo: todoData.data.detail

      // dep: depData.data.detail
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
