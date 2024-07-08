//import NextAuth from 'next-auth'

import { type DefaultSession, type DefaultUser } from 'next-auth'

//import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      firstname: string
      lastname: string
      token: string
      refreshToken: string
      dep: string
      role: number
      avatar: string
    }
  }
  interface User extends DefaultUser {
    firstname: string
    lastname: string
    token: string
    dep: string
    role: number
    avatar: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    firstname: string
    lastnamename: string
    token: string
    dep: string
    role: number
    avatar: string
  }
}

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       firstname: string
//     }
//   }
// }
