import { getServerSession } from 'next-auth'

import axios from 'axios'

import { options } from '@/app/api/auth/[...nextauth]/options'
import PositionDepList from '@/views/apps/department/position/list'

const getData = async ({ dep }: { dep?: any }) => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      dep: dep,
      token: session?.user.token
    }

    const token = { token: session?.user.token }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/departments/positions/list`, reqBody, {
      headers
    })

    if (response.data.message === 'success') {
      return response.data
    } else {
      return 'Position not found'
    }
  } catch (err) {
    console.log(err)
  }
}

const userDepPage = async ({ searchParams }: any) => {
  const { dep } = searchParams

  // dep = { dep: '66542134cf450c9ba79c2e23' }
  const data = await getData({ dep })
  const positionDepData = data.data.detail
  const positionData = data.data.positions
  const depData = data.data.departments

  // console.log('data.data.deps===============')
  // console.log(data.data.departments)
  // console.log('end data.data.deps===============')

  // console.log('positionDepData====')
  // console.log(positionDepData)
  return (
    <PositionDepList positionDepData={positionDepData} positionData={positionData} depData={depData} />

    // <>
    //   <h1>user level list</h1>
    //   department id : {dep}
    // </>
  )
}

export default userDepPage
