import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

import { sendEmail } from '@/utils/mailer'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { email } = reqBody

    const reqData = {
      email: email
    }

    const mailresponse = await sendEmail(reqData, 'forgot-password')

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      mailresponse
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
