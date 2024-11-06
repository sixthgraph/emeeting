import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// import { getServerSession } from 'next-auth'

// import { options } from './../../auth/[...nextauth]/options'

// export async function GET() {
//   const serverSession = await getServerSession(options)
//   const token = serverSession?.user.token
//   const email = serverSession?.user.email

//   console.log('token from todo route ====')
//   console.log(token)

//   try {
//     const headers = {
//       Authorization: `Bearer ${token}`,
//       cache: 'no-store'
//     }

//     const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}`, {
//       method: 'GET',
//       headers
//     })

//     const todoData = await response.json()

//     const data = {
//       todo: todoData.data.detail
//     }

//     return NextResponse.json(data)
//   } catch (error: any) {
//     return NextResponse.json({ error: error.massage })
//   }
// }

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { token, email } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      cache: 'force-cache'
    }

    const response = await fetch(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}`, { headers })

    const todoData = await response.json()

    if (todoData.message === 'success') {
      return NextResponse.json(todoData.data.detail)
    } else {
      const NotFoundData: any = []

      return NextResponse.json(NotFoundData)
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.massage })
  }
}
