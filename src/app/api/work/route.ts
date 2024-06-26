// Next Imports
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import axios from 'axios'
// Data Imports
import { db } from '@/app/api/fake-db/user-profile'

// export async function GET() {
//   return NextResponse.json(db)
// }

export async function GET(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const res = await axios.post(`${process.env.ROUTE_FLOW_API_URL}/getworkinfo`, reqBody)
    const workinfo = res.data.data.detail
    const response = NextResponse.json({
      message: res.data.message,
      success: true,
      data: workinfo
    })
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
