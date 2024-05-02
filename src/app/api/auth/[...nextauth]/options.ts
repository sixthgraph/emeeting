import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'

import axios from 'axios'

const login = async (credentials: any) => {
  const user = {
    email: credentials.username,
    password: credentials.password
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, user) // const response = await axios.post(`http://localhost:3000/api/users/login`, user)

    if (response.data.success) {
      console.log('Login success. ========> return : ', response.data)

      return response.data
    } else {
      console.log('Login failed.')

      return null
    }

    // return user;
  } catch (err) {
    console.log(err)
    throw new Error('Failed to login!')
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
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token && token.firstname && token.token) {
        session.user.name = token.name
        session.user.token = token.token
      }

      return session
    }
  }
}