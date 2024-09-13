import { headers } from 'next/headers'

import CommentList from '@/views/apps/comments'

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comment/list`, {
      headers: headers()
    })

    const data = await res.json()

    // console.log('page return data comment list')
    // console.log(data.commentdata)

    return data.commentdata
  } catch (err) {
    console.log(err)
  }
}

export default async function commentsPage() {
  const data = await getData()

  return <CommentList commentData={data} />
}
