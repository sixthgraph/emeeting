export type MyAppType = {
  _id: string
  client_alias: string
  color: string
  connections: string[]
  deligates: string
  description: string
  eforms: string[]
  documents: string[]
  enddate: string
  name: string
  nodes: string[]
  numberOfElements: number
  status: string
  startdate: string
}

export type MyAppTypeWithAction = MyAppType & {
  action?: string
}
