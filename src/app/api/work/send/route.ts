import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'

import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

import { sendEmail } from '@/utils/mailer'

export async function POST(request: NextRequest) {
  try {
    const serverSession = await getServerSession(options)
    const token = serverSession?.user.token

    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const reqBody = await request.json()

    console.log(`${process.env.ROUTE_FLOW_API_URL}/sendwork`)
    console.log(reqBody)
    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/sendwork`, reqBody, { headers })
    const sent = res.data.data.detail

    console.log('----res send-----')
    console.log(res)

    //reqbody createnotification
    //   {
    //     "wid": "66c3011f239239c95df75917",
    //     "email": [
    //         "chulapak@excelink.co.th",
    //         "supachai@excelink.co.th",
    //         "akkarapah@gmail.com"
    //     ],
    //     "from": "supakorn@excelink.co.th",
    //     "message": "invite comment"
    //    }

    const toemail = []

    toemail.push(reqBody.uid)

    const reqBodynotification = {
      wid: reqBody.wid,
      email: toemail,
      from: reqBody.senderuid,
      message: `New work incoming. ${reqBody.wid} `
    }

    console.log('--reqBodynotification--')
    console.log(reqBodynotification)

    try {
      const res_notification = await axios.post(
        `${process.env.ROUTE_FLOW_API_URL}/createnotification`,
        reqBodynotification,
        { headers }
      )

      console.log('--res notification--')
      console.log(res_notification)
    } catch (error: any) {
      console.log('error' + error.message)
    }

    const mailresponse = await sendEmail(reqBody.uid, reqBody.wid)

    console.log(mailresponse)

    const response = NextResponse.json({
      message: 'Send work successful',
      success: true,
      data: sent
    })

    return response
  } catch (error: any) {
    console.log('----res send-----')
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
