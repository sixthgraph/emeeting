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

    console.log('reqBody === ')
    console.log(reqBody)

    const signuri = 'https://rd.excelink.co.th/SarabanSignPDF.rt5/service.asmx/addSignature'

    //const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createcomment`, reqBody, { headers })

    const urlencoded = new URLSearchParams()

    //const form = new FormData()

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

    // const res = await fetch(signuri, {
    //   method: 'POST',
    //   body: urlencoded,
    //   headers: headers,
    //   redirect: 'follow'
    // })

    // const requestOptions = {
    //   method: 'POST',
    //   headers: headers,
    //   body: urlencoded,
    //   redirect: 'follow'
    // }

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
        console.log('this will be a string')
        console.log(data) // this will be a string
        // const parser = new DOMParser()
        // const xmlDoc = parser.parseFromString(data, 'application/xml')

        return data
      })
      .catch(error => console.error(error))

    const create_res = await res

    console.log('addsignature_res ----')
    console.log(create_res)

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
