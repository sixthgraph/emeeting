export type SearchWorkType_old = {
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
  datein: string
  workinprocessid: string
}
export type SearchWorkType = {
  _id: string
  action: string
  activity: string[]
  attachment: string[]
  comment: string[]
  completedate: string
  eformdata: string[]
  expiredate: string
  registerdate: string
  registerdep: string
  registeruid: string
  statecode: string
  status: string
  subject: string
  usercreateinfo: string[]
  wid: string
  workinprocess: string[]
}

export type SearchWorkTypeWithAction = SearchWorkType & {
  action?: string
}
