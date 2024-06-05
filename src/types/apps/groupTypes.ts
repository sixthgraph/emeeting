// Type Imports
import type { ThemeColor } from '@core/types'

export type GroupType = {
  groupid: number
  itemno: any
  groupname: string
  createby: string
  member: string[]
}

export type GroupFormDataType = {
  groupname: string
  member: string
}

export type GroupTypeWithAction = GroupType & {
  action?: string
}

export type MemberType = {
  [key: string]: { member: string }
}
