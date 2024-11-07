import { NextResponse, type NextRequest } from 'next/server'

import User from '@/models/userModel'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { email } = reqBody
    const deletedUser = await User.findOneAndDelete({ email })

    return NextResponse.json({
      message: 'Deleted user successfully',
      success: true,
      deletedUser
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
