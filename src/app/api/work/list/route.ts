// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

//import RoleDialog from '../../../../components/dialogs/role-dialog/index'
//import PricingDialog from '../../../../components/dialogs/pricing/index'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { wid, dep, token, email, wip } = reqBody

  // console.log(workflowid)
  // console.log(blockid)

  // console.log('reqBody---')
  // console.log(reqBody)

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

    // console.log('--workinprocess---')
    // console.log(workinprocess)

    const dataObj = workinprocess.filter((item: any) => {
      return item.id === wip //'6699081a5848117c8af11a20'
    })

    if (wip == '' || wip == null) {
      const curwip = workinprocess.filter((item: any) => {
        //item.action == '', item.uid == email
        return item.action == ''

        //return item
      })

      console.log('---curwip--')
      console.log(curwip)

      workinfo.workflowid = curwip[0].rid
      workinfo.blockid = curwip[0].pid
      workinfo.curuid = curwip[0].uid
      workinfo.curdep = curwip[0].dep

      const resnp2 = await axios.get(
        `${process.env.ROUTE_MANAGER_API_URL}/getnextprocess/${curwip[0].rid}/${curwip[0].pid}`,
        {
          headers
        }
      )

      let condata = resnp2.data

      if (curwip[0].uid !== email) {
        condata = null
      }

      const response2 = NextResponse.json({
        message: res.data.message,
        success: true,
        data: workinfo,
        conditionData: condata
      })

      return response2
    }

    if (dataObj.length > 0) {
      const rid = dataObj[0].rid
      const pid = dataObj[0].pid

      workinfo.curuid = dataObj[0].uid
      workinfo.curdep = dataObj[0].dep
      workinfo.workflowid = rid
      workinfo.blockid = pid

      console.log('dataObj')
      console.log(dataObj)
      console.log(rid)
      console.log(pid)

      const resnp = await axios.get(`${process.env.ROUTE_MANAGER_API_URL}/getnextprocess/${rid}/${pid}`, {
        headers
      })

      const response = NextResponse.json({
        message: res.data.message,
        success: true,
        data: workinfo,
        conditionData: resnp.data
      })

      return response
    } else {
      return NextResponse.json({ error: 'data not found.' }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
