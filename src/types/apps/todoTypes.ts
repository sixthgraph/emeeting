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
export type TodoType = {
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

export type TodoTypeWithAction = TodoType & {
  action?: string
}
