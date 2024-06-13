// Type Imports
import type { ThemeColor } from '@core/types'

export type DepartmentsType = {
  dep: string
  depname: string
  statecode: string
  statedesc: string
  docuname: number
  path: string
  sort: number
}

export type DepartmentFormDataType = {
  dep: string
  depname: string
  statecode: string
  docuname: number
  path: string
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
