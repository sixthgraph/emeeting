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

    const response = NextResponse.json({
      message: 'success',
      success: true,
      data: res.data
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
