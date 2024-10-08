import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { options } from '../../auth/[...nextauth]/options'
import axios from '@/utils/axios'

export async function GET() {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const response = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/workflows`, { headers })
    const resData = response?.data

    return NextResponse.json(resData)
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
