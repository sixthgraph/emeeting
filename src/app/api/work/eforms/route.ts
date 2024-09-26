// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token, rid } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const res = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/workflow/eforms/${rid}`, {
      headers
    })

    console.log('rid ===')
    console.log(rid)

    console.log('res === ')
    console.log(res)

    // const res_node = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/block/${rid}/startpoint`, {
    //   headers
    // })

    // const res_doc = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/workflow/documents/${rid}`, {
    //   headers
    // })

    // console.log('res_doc')
    // console.log(res_doc.data)

    //https://rd.excelink.co.th/routeflow-api/block/66826eb05aab127bc19d62ae/startpoint

    const response = NextResponse.json({
      message: 'success',
      success: true,
      data: res.data

      // nodeData: res_node.data,
      // docData: res_doc.data
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
