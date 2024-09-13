export type CommentType = {
  wid: string
  createby: string
  email: string
  avatar: string
  subject: string
  createdate: string
  expiredate: string
  status: string
  viewstatus: boolean
  currentuid: string
  currentname: string
  currentdept: string
  currentdeptname: string
  workflowid: string
  blockid: string
  processname: string
  task: string[]
  routename: string
  workinprocessid: string
  datein: string
  member: any[]
}

export type CommentTypeWithAction = CommentType & {
  action?: string
}
