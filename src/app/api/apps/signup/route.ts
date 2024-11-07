import { NextResponse, type NextRequest } from 'next/server'

import bcrypt from 'bcryptjs'

import User from '@/models/userModel'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { fullName, company, role, username, password, country, contact, email, plan, status } = reqBody

    //check if user already exits
    const user = await User.findOne({ email })

    if (user) {
      return NextResponse.json({ error: 'User already exist' }, { status: 400 })
    }

    //hash password
    // eslint-disable-next-line import/no-named-as-default-member
    const salt = await bcrypt.genSalt(10)
    // eslint-disable-next-line import/no-named-as-default-member
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      company,
      role,
      username,
      password: hashedPassword,
      country,
      contact,
      email,
      currentPlan: plan,
      billing: '',
      status
    })

    const savedUser = await newUser.save()

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      savedUser
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
