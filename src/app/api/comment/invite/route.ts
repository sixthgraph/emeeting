import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const reqBody = await request.json()

    //***body format****/
    // {
    //   "wid": "66ab566acaa7bbd88368defe",
    //   "email": [
    //     "chulapak@excelink.co.th",
    //     "webmaster@excelink.co.th"
    //     ],
    //   "invite_by": "supakorn@excelink.co.th"
    // }
    //*************/

    console.log('reqBody === NOON')
    console.log(reqBody)

    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/invitecomment`, reqBody, { headers })

    console.log('invite res ----')
    console.log(res.data)
    const delete_res = res.data

    if (delete_res.message == 'success') {
      const response = NextResponse.json({
        message: 'success',
        success: true,
        data: delete_res.data.detail
      })

      return response
    } else {
      return NextResponse.json({ error: delete_res.message }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
