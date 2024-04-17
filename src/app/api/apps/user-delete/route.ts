import { NextResponse, type NextRequest } from 'next/server'

import User from '@/models/userModel'

export async function POST(request: NextRequest) {
  console.log('delete user start ==========>')

  // return NextResponse.json({
  //   message: 'Deleted user successfully',
  //   success: true,
  //   email
  // })

  try {
    const reqBody = await request.json()
    const { email } = reqBody

    console.log('reqBody ======>')
    console.log(email)

    const deletedUser = await User.findOneAndDelete({ email })

    console.log(deletedUser)

    return NextResponse.json({
      message: 'Deleted user successfully',
      success: true,
      deletedUser
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
