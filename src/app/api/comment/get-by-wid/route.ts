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
    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getcomment?wid=${wid}`, {
      headers
    })

    console.log('response comment')
    console.log(response.data.data.detail)
    const data: any = [response.data.data.detail]

    console.log('data === ')
    console.log(data)

    const resObj = []

    for (const item of data) {
      resObj.push(item)
    }

    console.log('resObj ===')
    console.log(resObj)

    //return response.data.data.detail

    return NextResponse.json(resObj)
  } catch (error: any) {
    console.log('catch error')
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
