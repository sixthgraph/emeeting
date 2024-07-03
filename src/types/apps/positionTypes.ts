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
