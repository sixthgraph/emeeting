import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// import { getServerSession } from 'next-auth'

// import { options } from '../../auth/[...nextauth]/options'

export async function POST(req: NextRequest) {
  //const serverSession = await getServerSession(options)

  //const token = serverSession?.user.token
  //const email = serverSession?.user.email

  const reqBody = await req.json()
  const { token, email } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    // console.log('call getmyitems url ====')
    // console.log(`${process.env.ROUTE_FLOW_API_URL}/getmyrequest?id=${email}`)

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getsendwork?id=${email}`, { headers })

    //const depres = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getdepartment`, { headers })
    const sentData = await response.json()

    // const depData = await depres.json()

    // const data = {
    //   sent: sentData.data.detail

    //   //dep: depData.data.detail
    // }

    // console.log('sentData.data----------')
    // console.log(sentData.data)

    return NextResponse.json(sentData.data)

    // return NextResponse.json(sentData.data.detail)
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
