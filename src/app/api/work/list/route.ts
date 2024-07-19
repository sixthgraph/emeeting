// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

import RoleDialog from '../../../../components/dialogs/role-dialog/index'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { wid, dep, token, email, wip, workflowid, blockid } = reqBody

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0'
    }

    const res = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getworklist?id=${email}&dep=${dep}&wid=${wid}`, {
      headers
    })

    const workinfo = res.data.data.detail

    const workinprocess = res.data.data.detail.workinprocess

    console.log('--workinprocess---')
    console.log(workinprocess)

    const dataObj = workinprocess.filter(item => {
      return item.id === wip //'6699081a5848117c8af11a20'
    })

    if (dataObj.length > 0) {
      const rid = dataObj[0].rid
      const pid = dataObj[0].pid

      console.log('dataObj')
      console.log(dataObj)
      console.log(rid)
      console.log(pid)

      // const resnp = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/getnextprocess/${rid}/${pid}`, {
      //   headers
      // })
    } else {
    }

    const resnp = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/getnextprocess/${workflowid}/${blockid}`, {
      headers
    })

    const response = NextResponse.json({
      message: res.data.message,
      success: true,
      data: workinfo,
      conditionData: resnp.data
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
