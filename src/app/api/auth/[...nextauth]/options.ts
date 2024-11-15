import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'

// import { signOut, signIn } from 'next-auth/react'
// import { signIn } from 'next-auth/react'

import axios from 'axios'

let today: any = new Date()

const login = async (credentials: any) => {
  const user = {
    email: credentials.username,
    password: credentials.password
  }

  try {
    const response = await axios.post(`${process.env.API_URL}/users/login`, user) // const response = await axios.post(`http://localhost:3000/api/users/login`, user)

    if (response.data.success) {
      //console.log('Login success. ========> return : ', response.data)

      return response.data
    } else {
      //console.log('Login failed.')

      return null
    }

    // return user;
  } catch (err) {
    console.log(err)
    throw new Error('Failed to login!')
  }
}

// interface TokenResponse {
//   message: string;
//   token?: string; // The token is optional because it might not be present in case of an error
// }

// async function refreshAccessToken(tokenObject: any, userEmail: any): Promise<TokenResponse> {
//   try {
//     const tokenResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refreshToken`, {
//       token: tokenObject,
//       email: userEmail
//     })

//     return {
//       message: tokenResponse.data.message,
//       token: tokenResponse.data.token
//     }
//   } catch (error) {
//     return {
//       message: 'refresh token error'
//     }
//   }
// }

async function refreshAccessToken(tokenObject: any, userEmail: any) {
  console.log('start refresh token')

  try {
    const tokenResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refreshToken`, {
      token: tokenObject,
      email: userEmail
    })

    today = new Date()

    console.log('refrest token success')

    return {
      message: tokenResponse.data.message,
      token: tokenResponse.data.token
    }
  } catch (error) {
    console.log('refresh token false!')

    return {
      message: 'refresh token error',
      token: 'null'
    }
  }
}

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, //secret: 'xd9aV6GOOMOqEXMLReLl4hVu/U/4kmWTQq+FWUUyCIE=',
  pages: {
    signIn: `${process.env.NEXT_PUBLIC_APP_BASEPATH_URL}/en/login`
  },
  providers: [
    Google({
      clientId: 'dummy',
      clientSecret: 'dummy'
    }),
    Facebook({
      clientId: 'dummy',
      clientSecret: 'dummy'
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username:',
          type: 'text',
          placeholder: 'your-cool-username'
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'your-awesome-password'
        }
      },
      async authorize(credentials) {
        try {
          const result = await login(credentials)
          const user = result.data

          // console.log('api return after sigin')
          // console.log(result)

          return user
        } catch (err) {
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const prov = account?.provider

      if (prov === 'github') {
        console.log('i am github')
        console.log(account)
        console.log(user)
        console.log(profile)

        //TODO REGISTER GITHUB ACCOUNT TO ROUTEFLOW ACCOUNT
        /**
            const oauthUser = {
              email: user.email,
              password: 'github-oauth-p@ssW0rd'
            }

            try {
              console.log('oauthUser ==== ')
              console.log(oauthUser)

              const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/check-user`, oauthUser) // const response = await axios.post(`http://localhost:3000/api/users/login`, user)

              if (response.data.success) {
                console.log('Login success. ========> return : ', response.data)

                return true
              } else {
                console.log('Not found github user on routeflow')

                const registerRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, oauthUser)

                if (registerRes.data.success) {
                  console.log('Register github success === > ', registerRes.data.data.user)

                  return true
                }

                //return null
              }

              // return user;
            } catch (err) {
              console.log(err)
              throw new Error('Failed to login!')
            }
         */
        // connectToDb();
        // try {
        //   const user = await User.findOne({ email: profile.email });
        //   if (!user) {
        //     const newUser = new User({
        //       username: profile.login,
        //       email: profile.email,
        //       image: profile.avatar_url,
        //     });
        //     await newUser.save();
        //   }
        // } catch (err) {
        //   console.log(err);
        //   return false;
        // }
      }

      return true
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === 'update') {
        return { ...token, ...session.user }
      }

      if (user && user.firstname && user.token) {
        token.name = user.firstname + ' ' + user.lastname
        token.firstname = user.firstname
        token.token = user.token
        token.email = user.email
        token.avatar = user.avatar
        token.dep = user.dep
        token.role = user.role
        token.tokenExpire = today
      }

      const expireTime: any = new Date(String(token.tokenExpire))

      const diffMs = today - expireTime // milliseconds between now & Christmas

      // const diffDays = Math.floor(diffMs / 86400000); // days

      // const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours

      const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes

      // console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes")

      // console.log('NextAuth start compare refresh -----')
      // console.log(token.token)
      // console.log(expireTime)
      // console.log(today)
      // console.log('-------')

      console.log('NextAuth compare expire time')
      console.log(diffMins + ' minutes')

      if (diffMins == 19 || diffMins > 19 || diffMins < 0) {
        const refreshTokenData = await refreshAccessToken(token.token, token.email)

        if (refreshTokenData.message == 'success') {
          token.token = refreshTokenData.token
          token.tokenExpire = today
        } else {
          token.token = 'null'
        }
      }

      /* // sg here

      const refreshTokenData = await refreshAccessToken(token.token, token.email)

      if (refreshTokenData.message == 'success') {
      token.token = refreshTokenData.token

       } else {
         token.token = 'null'
       }
         */

      return token
    },
    session: async ({ session, token }) => {
      if (token && token.firstname && token.token) {
        const tExpire: any = token.tokenExpire

        session.user.name = token.name
        session.user.token = token.token
        session.user.tokenExpire = tExpire
        session.user.avatar = token.avatar
        session.user.dep = token.dep
        session.user.role = token.role
      }

      return session
    }
  }
}
