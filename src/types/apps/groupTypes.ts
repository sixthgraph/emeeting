// Type Imports

export type GroupType = {
  groupid: string
  itemno: any
  groupname: string
  createby: string
  member: string[]
}

export type GroupFormDataType = {
  groupid: string
  groupname: string
  createby: string
  member: string[]
}

export type GroupTypeWithAction = GroupType & {
  action?: string
}

export type MemberType = {
  [key: string]: { member: string }
}
