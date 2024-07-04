export type NewReqType = {
  basketid: string[]
  blockId: string
  client_alias: string
  color: string[]
  eformlist: string[]
  enddate: string
  nodetype: string
  processdsc: string
  processid: string
  processname: string
  routename: string
  startdate: string
  status: string
  userid: string
  workflowid: string
}

export type NewReqTypeWithAction = NewReqType & {
  action?: string
}
