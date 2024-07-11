export type MyrequestType = {
  avatar: string
  blockid: string
  createby: string
  email: string
  createdate: string
  currentdept: string
  currentname: string
  currentdeptname: string
  currentuid: string
  expiredate: string
  processname: string
  status: string
  subject: string
  task: string[]
  viewstatus: boolean
  wid: string
  workflowid: string
  routename: string
}

export type MyrequestTypeWithAction = MyrequestType & {
  action?: string
}
