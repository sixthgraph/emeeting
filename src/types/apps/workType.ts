export type WorkinfoType = {
  completedate: string
  expiredate: string
  registerdate: string
  registerdep: string
  registeruid: string
  statecode: string
  wid: string
  status: string
  subject: string
  EFORMS: EFORM_DATA[]
  Activities: ActivityType[]
  documents: Document[]
}

export type EFORM_DATA = {
  _id: string
  ed_id: number
  wid: string
  eform_id: string
  ed_data: JSON
  eform_tmp: JSON
}

export type ActivityType = {
  _id: string
  wid: string
  workflowid: string
  blockid: string
  actioins: ACTION[]
}
export type ACTION = {
  detail: string
  user: string
  date: string
}

export type Document = {
  _id: string
  wid: string
  dep: string
  attachdate: string
  attachname: string
  uid: string
  filename: string
  itemno: string
  linkwid: string
  allowupdate: string
}
