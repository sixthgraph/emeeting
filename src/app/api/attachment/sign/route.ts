import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  //const email = serverSession?.user.email

  try {
    const headers = {
      //Authorization: `Bearer ${token}`,
      'Content-type': 'application/x-www-form-urlencoded',
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

    //***debug by ohm */
    reqBody.uid = 'nbtc123456'
    reqBody.pwd = 'Nbtc123456'
    const signuri = 'https://rd.excelink.co.th/SarabanSignPDF.rt5/service.asmx/addSignature'
    const urlencoded = new URLSearchParams()
    let base64: string

    base64 = reqBody.unsignedPdf
    base64 = base64.split(',')[1]
    urlencoded.append('unsignedPdf', base64)
    urlencoded.append('uid', reqBody.uid)
    urlencoded.append('pwd', reqBody.pwd)
    urlencoded.append('x0', reqBody.x0)
    urlencoded.append('y0', reqBody.y0)
    urlencoded.append('imageWidth', reqBody.imageWidth)
    urlencoded.append('imageHeight', reqBody.imageHeight)
    urlencoded.append('pageNumber', reqBody.pageNumber)

    const res = await fetch(signuri, {
      method: 'POST',
      body: urlencoded,
      headers: headers,
      redirect: 'follow'
    })
      .then(function (response) {
        return response.text()
      })
      .then(function (data) {
        return data //will be string
      })
      .catch(error => console.error(error))

    const create_res = await res

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
