// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { wid, token } = reqBody

  const headers = {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0'
  }

  try {
    const resWorkData = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=""&dep=""&wid=${wid}`, {
      headers
    })

    console.log('resWorkData.data')
    console.log(resWorkData.data.data.detail)

    const resComment = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getcomment?wid=${wid}`, {
      headers
    })

    console.log('resComment comment')
    console.log(resComment.data.data.detail)
    const data: any = [resComment.data.data.detail]

    console.log('data === ')
    console.log(data)

    const workData = resWorkData.data.data.detail

    const workDataObj = {
      routename: workData.routename,
      wid: workData.wid,
      subject: workData.subject,
      registeruid: workData.registeruid
    }

    const resObj: any = []

    //resObj.workInfo = workDataObj

    if (data[0] !== null) {
      for (const item of data) {
        resObj.push(item)
      }

      resObj[0].workInfo = workDataObj
    } else {
      resObj.push({
        comment: [],
        member: [],
        workInfo: workDataObj
      })
    }

    //return response.data.data.detail

    //resObj[0].workInfo = workDataObj

    console.log('resObj ===')
    console.log(resObj)

    return NextResponse.json(resObj)
  } catch (error: any) {
    console.log('catch error')
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
