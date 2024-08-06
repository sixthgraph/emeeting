// Type Imports

export type DepartmentsType = {
  dep: string
  depname: string
  statecode: string
  statedesc: string
  docuname: number
  path: string
  parent: string
  sort: number
  ref: string
  remark: string
  create_date: string
  create_by: string
  update_date: string
  update_by: string
}

export type DepartmentFormDataType = {
  dep: string
  depname: string
  statecode: string
  docuname: number
  path: string
  parent: string
  sort: number
  ref: string
  remark: string
  create_date: string
  create_by: string
  update_date: string
  update_by: string
}

export type DepartmentsTypeWithAction = DepartmentsType & {
  action?: string
}

export type StateinfoType = {
  [key: string]: {
    statecode: string
    desc: string
  }
}

export type DepParentType = {
  [key: string]: {
    dep: string
    depname: string
    docuname: number
    path: string
    sort: number
    statecode: string
  }
}
