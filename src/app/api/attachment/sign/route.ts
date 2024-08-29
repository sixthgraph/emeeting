import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'
import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token
  const email = serverSession?.user.email

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    //--reqBody--
    // {
    //   'unsignedPdf': 'base64string',
    //   'uid': 'chulapak',
    //   'pwd': 'pwd2',
    //   'x0': '0',
    //   'y0': '0',
    //   'imageWidth': '100',
    //   'imageHeight': '70',
    //   'pageNumber': '1'
    // }

    const reqBody = await request.json()

    console.log('reqBody === ')
    console.log(reqBody)

    const signuri = 'https://rd.excelink.co.th/SarabanSignPDF.rt5/service.asmx/addDigitalSignatureWithImage'

    //const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createcomment`, reqBody, { headers })

    const form = new FormData()

    form.append('unsignedPdf', reqBody.unsignedPdf)
    form.append('uid', reqBody.uid)
    form.append('pwd', reqBody.pwd)
    form.append('x0', reqBody.x0)
    form.append('y0', reqBody.y0)
    form.append('imageWidth', reqBody.imageWidth)
    form.append('imageHeight', reqBody.imageHeight)
    form.append('pageNumber', reqBody.pageNumber)

    const res = await fetch(signuri, {
      method: 'POST',
      body: form,
      headers: headers
    })

    console.log('create_res ----')
    console.log(res.json)
    const create_res = res

    if (create_res) {
      const response = NextResponse.json({
        message: 'success',
        success: true,
        data: create_res
      })

      return response
    } else {
      return NextResponse.json({ error: create_res }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
