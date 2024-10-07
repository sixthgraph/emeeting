'use server'

import { getServerSession } from 'next-auth'

import { options } from '@/app/api/auth/[...nextauth]/options'
import axios from '@/utils/axios'

export const getDocument = async (wid: any) => {
  const serverSession = await getServerSession(options)
  const token = serverSession?.user.token

  const reqBody = {
    wid: wid,
    itemno: '',
    token: token
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/attachment/list`, reqBody)

    let resData = response.data.data

    console.log('getDocument return')
    console.log(response)

    if (!resData) {
      resData = []
    }

    return resData
  } catch (error: any) {
    console.log('Editwork failed. ', error.message)
  }
}

export const uploadAttachment = async (wid: any, email: any, dep: any, rid: any, pid: any, files: any) => {
  console.log('uploadAttachment start')

  try {
    const serverSession = await getServerSession(options)
    const token = serverSession?.user.token

    const headers = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`
    }

    return 'success'

    const form = new FormData()

    form.append('wid', wid)
    form.append('uid', email)
    form.append('dep', dep)
    form.append('rid', rid)
    form.append('pid', pid)
    form.append('refid', '')
    form.append('action', '')
    form.append('filename', '')

    //form.append('my_buffer', new Blob([1, 2, 3]))
    form.append('file', files[0])

    console.log('----form body createattachment from client call------')
    console.log(form)

    const response = await fetch(`${process.env.NEXT_PUBLIC_FLOW_API_URL}/createattachment`, {
      method: 'POST',
      body: form,
      headers: headers
    })

    console.log('response createattachment from client call------')
    console.log(response)

    return response
  } catch (error: any) {
    console.log('createattachment from client call failed. ', error.message)
  }
}
