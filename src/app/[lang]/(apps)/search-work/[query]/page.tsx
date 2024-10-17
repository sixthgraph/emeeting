'use server'

import { getServerSession } from 'next-auth'

import axios from 'axios'

import { options } from '@/app/api/auth/[...nextauth]/options'
import SearchWorkList from '@/views/apps/search-work'

const getData = async (query: any) => {
  const session = await getServerSession(options)

  try {
    const reqQuery = {
      caseType: 'global',
      Text: query
    }

    const reqBody = {
      queryData: reqQuery,
      token: session?.user.token
    }

    const token = { token: session?.user.token }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/search-work`, reqBody, {
      headers
    })

    return response.data.data.detail
  } catch (err) {
    console.log(err)
  }
}

const searchWorkPage = async ({ params }: { params: { query: string } }) => {
  const keyword = decodeURIComponent(params.query)
  const data = await getData(keyword)

  return <SearchWorkList keywordData={keyword} searchData={data} />
}

export default searchWorkPage
