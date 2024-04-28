// Next Imports
import { NextResponse } from 'next/server'

import { dbConnect } from '@/configs/dbConfig'
import User from '@/models/userModel'

dbConnect()

export async function GET() {
  const users = await User.find()

  return NextResponse.json(users)
}
