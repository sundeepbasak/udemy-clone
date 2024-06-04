import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

import bcrypt from 'bcrypt'
import { userService } from '@/services/user.service'
import { db } from '@/utils/database-driver.utils'

import { RdsClientV2 } from '@/utils/RdsClient'
import { redirect } from 'next/navigation'

const rds = new RdsClientV2()

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        try {
          if (credentials && credentials.email && credentials.password) {
            const { email, password } = credentials
            // console.log({ email, password })

            //check if email exists
            const queryExpr = db
              .selectFrom('misc_db.user')
              .selectAll()
              .where('email', '=', email)
            const rows = queryExpr.executeTakeFirst()
            type ResultType = Awaited<typeof rows>
            const { sql, parameters } = await queryExpr.compile()

            const [result, error] = await rds.queryOne<
              { email: string },
              ResultType
            >(
              {
                sql: sql,
                params: { email },
              },
              parameters
            )
            if (error !== null) {
              throw new Error(
                'Error querying get user by email' + error.message + error.stack
              )
            }

            const user = result.data
            if (!user) {
              throw new Error("User doesn't exist")
            }
            //check if passwords match
            const isPasswordMatch = await bcrypt.compare(
              password,
              user.password || ''
            )
            if (!isPasswordMatch) {
              throw new Error('Passwords do not match')
            }

            //check if user is an active user
            const isActive = user && user.is_active
            if (!isActive) {
              throw new Error(`Your account ${email} has been deactivated`)
            }

            console.log('nextauth', { user })
            return user
          }
          console.error('Invalid credentials:', credentials)
          return null
        } catch (error: any) {
          console.error('NEXT AUTH Error', error)
          throw new Error(error.message)
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth',
    // error: '/auth'
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async session({ session, token, user }) {
      return session
    },

    async jwt({ token, profile, account, user }) {
      // console.log('inside jwt in next auth')
      const userId = await userService.getIdByEmail(token.email!)
      token.userId = userId
      // console.log('inside jwt in next auth 2', token)
      return token
    },

    // async jwt({ account, token, user, profile }) {
    //     const dbUser = await db.selectFrom('user').selectAll().where('email', '=', token.email || "").executeTakeFirstOrThrow();

    //     const role = await db
    //         .selectFrom('user_roles')
    //         .innerJoin('roles', 'roles.id', 'user_roles.role_id')
    //         .where('user_roles.user_id', '=', dbUser.id)
    //         .select(['roles.id', 'roles.name'])
    //         .executeTakeFirstOrThrow();

    //     return { ...token, role: role.name }
    // },

    async signIn({ account, profile, user, credentials, email }) {
      // console.log("inside google signin", { account }, { profile }, { user }, { credentials }, { email });
      try {
        if (account && account.provider === 'google') {
          //if user already exists: return true
          const existingUser = await userService.getIdByEmail(user.email)
          if (existingUser) {
            console.log('existing user true')
            return true
          } else {
            /** transaction
             * - get the id(default_role_id) of the default role ('user') from the roles table
             * - insert the values(coming from body) in the users table
             * - get the id(user_id) of the created user
             * - insert the user_id and default_role_id to the user_roles table
             */
            const queries = []
            const query1 = rds.queryOne<
              {},
              {
                id: number
              }
            >({
              sql: `select id from misc_db."roles" where name = 'USER';`,
              params: {},
            })

            const query2 = rds.queryOne<
              {
                fullname: string
                email: string
                password: string
                avatar: string
              },
              { id: number }
            >({
              sql: `INSERT INTO misc_db."user"
                                (fullname, email, "password", avatar, created_at, is_verified, is_active)
                                VALUES(:fullname, :email, :password, :avatar, now(), true, true) returning id;`,
              params: {
                fullname: user.name || '',
                email: user.email,
                password: '',
                avatar: user.image ?? null,
              },
            })

            queries.push(query1, query2)
            const results = await Promise.all(queries)
            const [res1, err1] = results[0]
            const [res2, err2] = results[1]

            if (!res1?.data) {
              throw new Error(
                'Error while getting default role' + err1?.message + err1?.stack
              )
            }
            if (!res2?.data) {
              throw new Error(
                'Error while creating user' + err2?.message + err2?.stack
              )
            }

            const [result3, error3] = await rds.mutateOne<
              { userId: number; roleId: number },
              {}
            >({
              sql: `INSERT INTO misc_db.user_roles
                                    (user_id, role_id)
                                    VALUES(:userId, :roleId );
                                    `,
              params: { userId: res2?.data?.id, roleId: res1?.data?.id },
            })
            return true
          }
        } else {
          return false
        }
      } catch (error: any) {
        console.error('Error during sign-in:', error)
        // throw new Error(error.message)
        return 'error'
      }
    },

    async redirect({ baseUrl, url }) {
      console.log('REDIRECT 1', baseUrl, url);
      const returnUrl = new URL(url, baseUrl).searchParams.get('next');
      const callbackUrl = new URL(url, baseUrl).searchParams.get('callbackUrl');

      console.log('REDIRECT 2', baseUrl, url, returnUrl, callbackUrl);
      if (returnUrl) {
        console.log('RETURN-URL', returnUrl)
        return returnUrl;
      } else if (callbackUrl) {
        return callbackUrl;
      } else {
        console.log('BASE-URL', baseUrl)
        // return url;
        return url;
      }
    },
  },
}
