import { getServerSession } from 'next-auth'

import CommentList from '@/views/apps/comments'
import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

const getCommentData = async () => {
  const session = await getServerSession(options)

  try {
    const reqBody = {
      token: session?.user.token,
      email: session?.user.email
    }

    const headers = {
      Authorization: `Bearer ${reqBody.token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comment/list`, reqBody, { headers })

    return response.data
  } catch (err) {
    console.log(err)
  }
}

export default async function commentsPage() {
  const data = await getCommentData()

  return <CommentList commentData={data} />
}
