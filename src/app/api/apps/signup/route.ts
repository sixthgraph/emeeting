import { NextResponse, type NextRequest } from 'next/server'

import bcrypt from 'bcryptjs'

import User from '@/models/userModel'

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { fullName, company, role, username, password, country, contact, email, plan, status } = reqBody

    console.log('reqBody ===')
    console.log(reqBody)

    //const savedUser = await axios.post('http://localhost:9995/register', reqBody)
    // const savedUser = await axios.post('https://rd.excelink.co.th/routeflow-api-main/register', reqBody)

    //check if user already exits
    const user = await User.findOne({ email })

    if (user) {
      return NextResponse.json({ error: 'User already exist' }, { status: 400 })
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
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

    console.log(savedUser)

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      savedUser
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.massage })
  }
}
