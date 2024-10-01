'use server'
import { headers } from 'next/headers'

const getGroupList = async () => {
  console.log('getGroupList start')

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/list`, {
      headers: headers()
    })

    const data = await res.json()

    console.log('getGroupList return')
    console.log(data)

    return data
  } catch (err) {
    console.log(err)
  }
}

export default getGroupList
