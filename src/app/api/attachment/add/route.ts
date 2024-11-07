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
  try {
    const serverSession = await getServerSession(options)
    const token = serverSession?.user.token

    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`
    }

    const reqBody = await request.json()

    const form = new FormData()

    form.append('wid', reqBody.wid)
    form.append('id', reqBody.id)
    form.append('dep', reqBody.dep)
    form.append('file', '/Users/sixthgraph/Desktop/avatar.png')

    const res = await fetch(`${process.env.ROUTE_FLOW_API_URL}/createattachment`, {
      method: 'POST',
      body: form,
      headers: headers
    })

    const data = await res.json()
    const attm = data

    const response = NextResponse.json({
      message: data,
      success: true,
      data: attm
    })

    return response
  } catch (error: any) {
    console.log(error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
