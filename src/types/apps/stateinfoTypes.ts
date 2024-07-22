// Type Imports

export type StateinfosType = {
  id: number
  statecode: string
  desc: string
  ref: string
  remark: string
  create_date: string
  create_by: string
  update_date: string
  update_by: string
}

export type StateinfoFormDataType = {
  statecode: string
  desc: string
  ref: string
  remark: string
  create_date: string
  create_by: string
  update_date: string
  update_by: string
}

export type StateinfosTypeWithAction = StateinfosType & {
  action?: string
}
