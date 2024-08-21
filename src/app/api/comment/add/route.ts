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

    //******/ new post
    // {
    //   "wid": "66c3011f239239c95df75917",
    //   "registeruid": "supakorn@excelink.co.th",
    //   "message": "New Comment",
    //   "file": "",
    //   "location": "",
    //   "level": 0,
    //   "itemno": 0,
    //   "reply_itemno": 0
    // }

    //******/ reply to item-level0
    // {
    //   "wid": "66c3011f239239c95df75917",
    //   "registeruid": "supakorn@excelink.co.th",
    //   "message": "Reply New Comment",
    //   "file": "",
    //   "location": "",
    //   "level": 1,
    //   "itemno": 1, //item of level0
    //   "reply_itemno": 0 //always 0
    // }

    //******/ reply to item-level1
    // {
    //   "wid": "66c3011f239239c95df75917",
    //   "registeruid": "supakorn@excelink.co.th",
    //   "message": "Reply Reply New Comment",
    //   "file": "",
    //   "location": "",
    //   "level": 1,
    //   "itemno": 1, //item of level0
    //   "reply_itemno": 1 //item of level1 to reply
    // }

    console.log('reqBody === ')
    console.log(reqBody)

    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createcomment`, reqBody, { headers })

    console.log('create_res ----')
    console.log(res.data)
    const create_res = res.data

    if (create_res.message == 'success') {
      const response = NextResponse.json({
        message: 'success',
        success: true,
        data: create_res.data.detail
      })

      return response
    } else {
      return NextResponse.json({ error: create_res.message }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
