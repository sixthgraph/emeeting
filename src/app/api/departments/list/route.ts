import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import axios from 'axios'
import { getServerSession } from 'next-auth'
import { options } from '../../auth/[...nextauth]/options'
import { stepClasses } from '@mui/material'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token } = reqBody

  //console.log('server token ==', token)

  // const serverSession = await getServerSession(options)
  // const token2 = serverSession?.user.token

  // console.log('server token dep ==', token2)

  try {
    const headers = { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', Pragma: 'no-cache', Expires: '0' }

    const response = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getdepartment`, { headers })
    const stateinfores = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getstateinfo`, { headers })

    if (stateinfores.data.message === 'success') {
      response.data.data.stateinfos = stateinfores.data.data.detail
      // console.log('server reponse stateinfores ==============================')
      //console.log(stateinfores.data.data.detail)
      // console.log(response.data)
      // console.log('end server reponse stateinfores ==============================')
    }

    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
