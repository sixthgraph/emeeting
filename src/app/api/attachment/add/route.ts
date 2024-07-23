//import { promises as fs } from 'fs'
// import fs from 'fs'

// import path from 'path'

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

// import axios from 'axios'

import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  console.log('start post ---')

  try {
    const serverSession = await getServerSession(options)
    const token = serverSession?.user.token

    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const reqBody = await request.json()

    const form = new FormData()

    form.append('wid', reqBody.wid)
    form.append('id', reqBody.id)
    form.append('dep', '66542134cf450c9ba79c2e23')

    // form.append('file', '/Users/chulapakboonyasopon/Downloads/IMG_0887.JPG')
    form.append('file', 'blob:http://localhost:3000/46f22899-7b07-492b-9f9c-a9666761deb1')

    // //form.append('my_buffer', new Blob([1, 2, 3]))
    // form.append('my_file', reqBody.my_file)

    console.log('createattachment reqBody')

    //console.log(`${process.env.ROUTE_FLOW_API_URL}/createattachment`)
    console.log(form)
    console.log(reqBody.my_file.path)

    //const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/createattachment`, form, { headers })

    const res = await fetch(`${process.env.ROUTE_FLOW_API_URL}/createattachment`, {
      method: 'POST',
      body: form,
      headers: headers
    })

    const data = await res.text()

    console.log(data)

    const attm = data

    console.log('----res createattachment-----')
    console.log(res)

    const response = NextResponse.json({
      message: data,
      success: true,
      data: attm
    })

    return response
  } catch (error: any) {
    console.log('----error createattachment-----')
    console.log(error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
