import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { sendEmail } from '@/utils/mailer'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()

    const { email, from, message, title } = reqBody

    const reqData = {
      email: email,
      from: from,
      title: title,
      message: message
    }

    console.log('--reqData--')
    console.log(reqData)

    const mailResponse = await sendEmail(reqData, 'send-notification')

    console.log('mailResponse notification ---- ')
    console.log(mailResponse)

    const response = NextResponse.json({
      message: 'success',
      success: true,
      data: mailResponse
    })

    return response
  } catch (error: any) {
    console.log('----res send-----')
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
