'use client'

import { io } from 'socket.io-client'

//export const socket = io()

// export const socket = io.connect('https://rd.excelink.co.th:9993', {
//   secure: false,
//   rejectUnauthorized: false,
//   reconnection: true,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
//   reconnectionAttempts: 5
// })

export const socket = io('ws://rd.infoma.net/routeflow-api', {
  secure: false,
  rejectUnauthorized: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5

  //reconnectionDelayMax: 10000,
  // auth: {
  //   token: '123'
  // },
  // query: {
  //   'my-key': 'my-value'
  // }
})
