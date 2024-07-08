export type TodoTypeV1 = {
  id: number
  created_by: string
  subject: string
  type: string
  status: string
  overdue: boolean
  readed: boolean
  created: string
}
export type TodoTypeV2 = {
  wid: string
  Completedate: string
  Expiredate: string
  Registerdate: string
  registerdep: string
  registeruid: string
  subject: string
  statecode: string
  status: string
  firstname: string
  lastname: string
  workflowid: string
  connectionid: string
  pagesourceid: string
  pagetargetid: string
  conditions: string
  nodeid: string
  blockid: string
  processname: string
  userid: string
  basketid: string
  user_field: [string]
  task: [string]
  eformlist: [string]
}

export type TodoType = {
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

export type TodoTypeWithAction = TodoType & {
  action?: string
}
