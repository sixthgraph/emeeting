import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import axios from 'axios'

export async function POST(req: NextRequest) {
  const reqBody = await req.json()
  const { wid, dep, token, email, wip } = reqBody

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

    let commentdata

    try {
      const res_comment = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/getcomment?wid=${wid}`, {
        headers
      })

      commentdata = res_comment.data.data.detail
    } catch (err: any) {
      console.log(err.message)

      commentdata = null
    }

    if (!commentdata) {
      commentdata = null
    }

    const myworkinprocess = workinprocess.filter((item: any) => {
      return item.uid === email
    })

    if (myworkinprocess.length > 0) {
      workinfo.datein = myworkinprocess[0].Datein
      workinfo.curdep = myworkinprocess[0].dep
    }

    if (wip == '' || wip == null) {
      const curwip = workinprocess.filter((item: any) => {
        return item.action == ''
      })

      if (curwip.length == 0) {
        const condataObj = ['null']

        const response2 = NextResponse.json({
          message: res.data.message,
          success: true,
          data: workinfo,
          conditionData: condataObj,
          commentData: commentdata,
          documentData: 'aaa',
          res_notification: null
        })

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

        const res_doc = await axios.get(`${process.env.ROUTE_FLOW_API_URL}/workflow/documents/${curwip[0].rid}`, {
          headers
        })

        const res_node = await axios.get(
          `${process.env.ROUTE_MANAGER_API_URL}/block/${curwip[0].rid}/${workinfo.blockid}`,
          {
            headers
          }
        )

        try {
          const res_notification = await axios.get(
            `${process.env.ROUTE_FLOW_API_URL}/notification/${curwip[0].rid}/${curwip[0].pid}`,
            {
              headers
            }
          )

          const resnp2 = await axios.get(
            `${process.env.ROUTE_FLOW_API_URL}/getnextprocess?workflowid=${curwip[0].rid}&blockid=${curwip[0].pid}&wid=${wid}`,
            {
              headers
            }
          )

          let condata = resnp2.data.data

          const condataDetail = condata.detail

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
            if (condata.detail == null && curwip[0].uid == email) {
              condata = 'end-process'
              condataObj = ['end-process']
            }
          }

          const response2 = NextResponse.json({
            message: res.data.message,
            success: true,
            data: workinfo,
            conditionData: condataObj,
            commentData: commentdata,
            documentData: res_doc.data,
            nodeData: res_node.data,
            notificationData: res_notification.data
          })

          return response2
        } catch (err: any) {
          //error call getnextprocess

          console.log('error call getnextprocess\n' + err)

          const response2 = NextResponse.json({
            message: res.data.message,
            success: true,
            data: workinfo,
            conditionData: ['null'],
            commentData: commentdata,
            documentData: res_doc.data,
            nodeData: res_node.data,
            notificationData: null
          })

          return response2
        }
      }
    }
  } catch (error: any) {
    console.log(error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
