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

    //******/ reqBody format
    // {
    //   "wid": "66ab566acaa7bbd88368defe",
    //   "message": "New Reply",
    //   "file": "",
    //   "location": "",
    //   "level": 1,
    //   "itemno": 2,
    //   "reply_itemno": 1
    // }

    console.log('reqBody === ')
    console.log(reqBody)

    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/updatecomment`, reqBody, { headers })

    console.log('updatecomment_response ----')
    console.log(res.data)
    const update_res = res.data

    if (update_res.message == 'success') {
      const response = NextResponse.json({
        message: 'success',
        success: true,
        data: update_res.data.detail
      })

      return response
    } else {
      return NextResponse.json({ error: update_res.message }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}