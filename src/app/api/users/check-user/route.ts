import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// import jwt from 'jsonwebtoken'

import axios from 'axios'

export async function POST(request: NextRequest) {
  console.log('start post login-----------------------')

  try {
    const reqBody = await request.json()
    const res = await axios.post('http://localhost:9995/login', reqBody)
    const user = res.data.data.detail

    // console.log('user ==== ')
    // console.log(user)

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
      data: user
    })

    //const response = NextResponse.json(user)

    return response

    /**
     *
    //Create token
    try {
      const token = await jwt.sign(user, process.env.TOKEN_SECRET!, { expiresIn: '1d' })

      console.log('token ====')
      console.log(token)

      const response = NextResponse.json({
        message: 'Login successful',
        success: true
      })

      response.cookies.set('token', token, {
        httpOnly: true
      })

      return response
    } catch (error: any) {
      console.log('token error : ', error)

      return NextResponse.json({ error: error.message }, { status: 500 })
    }
     */
  } catch (error: any) {
    const response = NextResponse.json({
      message: 'Login Failed',
      success: false
    })

    return response

    //return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
