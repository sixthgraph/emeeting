import { getServerSession } from 'next-auth'

// Component Imports
import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

const getData = async ({ wid, dep }: { wid?: any; dep?: any }) => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      wid: wid,
      dep: dep,
      token: session?.user.token,
      email: session?.user.email
    }

    const headers = {
      Authorization: `Bearer ${reqBody.token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/my-items/list`, reqBody, { headers })

    if (response.data.message === 'success') {
      return response.data
    } else {
      //throw new Error('Failed to fetch my-items')

      return 'Failed to fetch my-items'
    }
  } catch (err) {
    console.log(err)
  }
}

const myItemsPage = async ({ searchParams }: any) => {
  const { wid, dep } = searchParams

  const data = await getData({ wid, dep })

  // try {
  //   const data = await getData({ wid, dep })

  //   resData = data
  // } catch (error) {
  //   resData = error
  // }

  return <>{data}</>
}

export default myItemsPage

// export default function Page() {
//   return (
//     <div>
//       <h1>My Items page</h1>
//     </div>
//   )
// }
