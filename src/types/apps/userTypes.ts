// Type Imports
import type { ThemeColor } from '@core/types'

export type UsersType = {
  id: number
  firstname: string
  lastname: string
  fullName: string
  email: string
  avatar: string
  password: string
  dep: string[]
  position: string
  role: string
  status: string
  startdate: string
  updated_at: string
  token: string
  refresh_token: string
  otp_secret: string
  avatarcolor?: ThemeColor
}

export type UserFormDataType = {
  firstname: string
  lastname: string
  fullName: string
  email: string
  password: string
  avatar: string
  avatarcolor: string
  dep: string
  position: string
  status: string
  role: number
}

export type UsersTypeExample = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
  billing: string
  firstname: string
  lastname: string
  token: string
}

export type UsersTypeWithAction = UsersType & {
  action?: string
}

export type UserRoleType = {
  [key: string]: { icon: string; color: string; name: string }
}

export type RoleType = {
  [key: string]: { properties: []; roleid: number; rolename: string }
}

export type DepType = {
  [key: string]: { dep: string; depname: string; docuname: number; path: string; sort: number; statecode: string }
}

export type UserStatusType = {
  [key: string]: ThemeColor
}
