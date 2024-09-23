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
      return response.data
    } else {
      throw new Error('Failed to fetch workdata')
    }
  } catch (err) {
    console.log(err)
  }
}

const workPage = async ({ searchParams }: any) => {
  const { wid, dep, rid, pid } = searchParams
  const data = await getData({ wid, dep, rid, pid })

  console.log('work/eform data')
  console.log(data)

  return (
    <WorkCreate data={data.data} nodeData={data.nodeData} docData={data.docData} />

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
