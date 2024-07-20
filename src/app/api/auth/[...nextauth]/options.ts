import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'

import { signOut } from 'next-auth/react'

import axios from 'axios'

const login = async (credentials: any) => {
  const user = {
    email: credentials.username,
    password: credentials.password
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, user) // const response = await axios.post(`http://localhost:3000/api/users/login`, user)

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
  try {
    const tokenResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refreshToken`, {
      token: tokenObject,
      email: userEmail
    })

    return {
      message: tokenResponse.data.message,
      token: tokenResponse.data.token
    }
  } catch (error) {
    return {
      message: 'refresh token error'
    }
  }
}

export const options: NextAuthOptions = {
  // secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/en/login'
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

          console.log('api return after sigin')
          console.log(result)

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
      }

      const refreshTokenData = await refreshAccessToken(token.token, token.email)

      if (refreshTokenData.message == 'success') {
        // console.log('refreshToken success')
        token.token = refreshTokenData.token
      } else {
        console.log('refreshToken failed')

        // token.name = ''
        // token.firstname = ''
        // token.token = ''
        // token.email = ''

        //const logoutCognitoUrl = `${process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN}/logout?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&logout_uri=${process.env.NEXT_PUBLIC_APP_URL}/login&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/login&response_type=code`
        const logoutCognitoUrl = `${process.env.EXT_PUBLIC_APP_URL}/logout?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&logout_uri=${process.env.NEXT_PUBLIC_APP_URL}/login&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/login&response_type=code`

        signOut({ redirect: false }).then(() => console.log('logoutCognitoUrl === ', logoutCognitoUrl))

        // signOut({ redirect: false })
        return false
      }

      //console.log('tokenB 5 ==== ', refreshTokenData)

      return token
    },
    session: async ({ session, token }) => {
      if (token && token.firstname && token.token) {
        session.user.name = token.name
        session.user.token = token.token
        session.user.avatar = token.avatar
        session.user.dep = token.dep
        session.user.role = token.role
      }

      return session
    }
  }
}
