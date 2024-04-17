import { NextResponse, type NextRequest } from 'next/server'

// import bcrypt from 'bcryptjs'

import User from '@/models/userModel'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { fullName, company, role, username, country, contact, email, currentPlan, status } = reqBody

    const updateUser = {
      fullName: fullName,
      company: company,
      role: role,
      username: username,
      country: country,
      contact: contact,
      email: email,
      currentPlan: currentPlan,
      status: status
    }

    const updatedUser = await User.findOneAndUpdate({ email }, updateUser)

    console.log(updatedUser)

    return NextResponse.json({
      message: 'User updated successfully',
      success: true,
      updatedUser
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
