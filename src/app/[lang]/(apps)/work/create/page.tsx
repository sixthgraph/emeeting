import { getServerSession } from 'next-auth'

// Component Imports
// import { Card, CardContent, Typography } from '@mui/material'

import { options } from '@/app/api/auth/[...nextauth]/options'

import axios from '@/utils/axios'
import WorkCreate from '@/views/apps/workV2/create'

// import WorkDetailV2 from '@/views/apps/workV2'

const getData = async ({ dep, rid, pid }: { wid?: any; dep?: any; rid?: any; pid?: any }) => {
  // Vars
  const session = await getServerSession(options)

  console.log('req body ====')
  console.log(dep)
  console.log(rid)
  console.log(pid)

  try {
    const reqBody = {
      dep: dep,
      pid: pid,
      rid: rid,
      token: session?.user.token,
      email: session?.user.email
    }

    const headers = {
      Authorization: `Bearer ${reqBody.token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/work/eforms`, reqBody, { headers })

    if (response.data.message === 'success') {
      return response.data.data
    } else {
      throw new Error('Failed to fetch workdata')
    }
  } catch (err) {
    console.log(err)
  }
}

const workPage = async ({ searchParams }: any) => {
  // const wid = searchParams.wid
  // const dep = searchParams.dep

  const { wid, dep, rid, pid } = searchParams

  console.log('search params----')
  console.log(searchParams)

  const data = await getData({ wid, dep, rid, pid })

  // console.log('new request page data === ')
  // console.log(data)

  // return <WorkDetail workData={searchParams} data={data} tabContentList={tabContentList(data)} />
  return (
    <WorkCreate data={data} />

    //  <>
    //     <h1>For SG - create new request</h1>
    //     {data.map((form: any) => {
    //       return (
    //         <>
    //           <Card key={form.form_id} className='my-4'>
    //             <CardContent>
    //               <Typography>
    //                 <b>form_id :</b> {form.form_id}
    //               </Typography>
    //               <Typography>
    //                 <b>form_name :</b> {form.form_name}
    //               </Typography>
    //               <Typography>
    //                 <b>form_template :</b> {JSON.stringify(form.form_template)}
    //               </Typography>
    //             </CardContent>
    //           </Card>
    //         </>
    //       )
    //     })}
    //   </>
  )
}

export default workPage
