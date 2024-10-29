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

export const socket = io('http://localhost:9995', {
  secure: false,
  rejectUnauthorized: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
})
