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
}

export type DepartmentFormDataType = {
  dep: string
  depname: string
  statecode: string
  docuname: number
  path: string
  parent: string
  sort: number
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
