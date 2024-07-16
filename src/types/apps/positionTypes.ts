// Type Imports
import type { ThemeColor } from '@core/types'

export type PositionsType = {
  id: number
  positioncode: string
  desc: string
  level: string
  ref: string
  status: string
  remark: string
  create_date: string
  create_by: string
  update_date: string
  update_by: string
}

export type PositionFormDataType = {
  positioncode: string
  desc: string
  level: string
  ref: string
  status: string
  remark: string
  create_date: string
  create_by: string
  update_date: string
  update_by: string
}

export type PositionsTypeWithAction = PositionsType & {
  action?: string
}

export type PositionsDepType = {
  dep: string
  depname: string
  path: string
  sort: string
  ref: string
  positioncode: string
  positiondesc: string
  positionpath: string
  positionlevel: string
  positionref: string
}

export type PositionDepFormDataType = {
  dep: string
  depname: string
  path: string
  sort: string
  ref: string
  positioncode: string
  positiondesc: string
  positionpath: string
  positionlevel: string
  positionref: string
  positionparent: string
  depparent: string
}

export type DepType = {
  [key: string]: {
    dep: string
    depname: string
    docuname: number
    path: string
    sort: number
  }
}
export type PositionFilterType = {
  [key: string]: {
    positioncode: string
    desc: string
    level: string
    ref: string
    status: string
    remark: string
  }
}

export type PositionsDepTypeWithAction = PositionsDepType & {
  action?: string
}
