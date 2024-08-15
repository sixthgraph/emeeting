// Next Imports

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

//import RoleDialog from '../../../../components/dialogs/role-dialog/index'
//import PricingDialog from '../../../../components/dialogs/pricing/index'
//import { null_ } from 'valibot'

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

    // console.log('res.data.data')
    // console.log(res.data.data.detail)

    // console.log('--workinprocess---')
    // console.log(workinprocess)

    const dataObj = workinprocess.filter((item: any) => {
      return item.id === wip //'6699081a5848117c8af11a20'
    })

    const myworkinprocess = workinprocess.filter((item: any) => {
      return item.uid === email
    })

    if (myworkinprocess.length > 0) {
      workinfo.datein = myworkinprocess[0].Datein
      workinfo.curdep = myworkinprocess[0].dep
    }

    if (wip == '' || wip == null) {
      const curwip = workinprocess.filter((item: any) => {
        //item.action == '', item.uid == email
        return item.action == ''

        //return item
      })

      console.log('---curwip--')
      console.log(curwip.length)

      if (curwip.length == 0) {
        //const condata = null
        const condataObj = ['null']

        const response2 = NextResponse.json({
          message: res.data.message,
          success: true,
          data: workinfo,
          conditionData: condataObj
        })

        console.log('response2')
        console.log(response2)

        return response2
      } else {
        workinfo.workflowid = curwip[0].rid
        workinfo.blockid = curwip[0].pid
        workinfo.curuid = curwip[0].uid
        workinfo.curdep = curwip[0].dep
        workinfo.datein = curwip[0].Datein

        workinfo.senderuid = curwip[0].senderuid
        workinfo.senderpid = curwip[0].senderpid
        workinfo.action = curwip[0].action

        console.log('uri getnextprocess')
        console.log(
          `${process.env.ROUTE_FLOW_API_URL}/getnextprocess?workflowid=${curwip[0].rid}&blockid=${curwip[0].pid}&wid=${wid}`
        )

        const resnp2 = await axios.get(
          `${process.env.ROUTE_FLOW_API_URL}/getnextprocess?workflowid=${curwip[0].rid}&blockid=${curwip[0].pid}&wid=${wid}`,
          {
            headers
          }
        )

        console.log('resnp2')
        console.log(resnp2.data.data)

        let condata = resnp2.data.data

        const condataDetail = condata.detail

        console.log('condataDetail')
        console.log(condataDetail)

        let condataObj = []

        if (condataDetail) {
          console.log('have condata')

          for (let i = 0; i < condataDetail.length; i++) {
            condataObj.push(condataDetail[i])
          }
        } else {
          console.log('condata null')
        }

        console.log('condata---')
        console.log(condata)

        if (curwip[0].uid !== email && condata !== null) {
          condata = null
          condataObj = ['null']
        } else {
          if (condata == null && curwip[0].uid == email) {
            condata = 'end-process'
            condataObj = ['end-process']
          }
        }

        // console.log('condataObj[0]---')
        // console.log(condataObj[0])

        // console.log('res.data.data.detail')
        // console.log(res.data.data.detail)

        const response2 = NextResponse.json({
          message: res.data.message,
          success: true,
          data: workinfo,
          conditionData: condataObj
        })

        console.log('response222')
        console.log(response2)

        return response2
      }
    }

    if (dataObj.length > 0) {
      console.log('dataObj')
      console.log(dataObj)

      const rid = dataObj[0].rid
      const pid = dataObj[0].pid

      workinfo.curuid = dataObj[0].uid
      workinfo.curdep = dataObj[0].dep
      workinfo.datein = dataObj[0].Datein
      workinfo.workflowid = rid
      workinfo.blockid = pid

      workinfo.senderuid = dataObj[0].senderuid
      workinfo.senderpid = dataObj[0].senderpid
      workinfo.action = dataObj[0].action

      console.log(rid)
      console.log(pid)

      const resnp = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getnextprocess/${rid}/${pid}`, {
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
