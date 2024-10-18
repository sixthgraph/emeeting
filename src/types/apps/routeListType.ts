export type RouteListDataType = {
  complete: string
  routename: string
  total: string
}

export type RouteListTypeWithAction = RouteListDataType & {
  action?: string
}
