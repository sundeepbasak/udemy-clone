'use server'

import { RdsClientV2 } from "@/utils/RdsClient";
import { db } from "@/utils/database-driver.utils";
import bcrypt from 'bcrypt'
import { redirect } from "next/navigation";

interface IRegisterUser {
    fullname: string
    email: string
    password: string
}

interface IAdmin {
    email: string;
    password: string;
}


const rds = new RdsClientV2();


export async function registerUser(data: IRegisterUser) {
    const { fullname, email, password } = data; try {
        console.log("register user hit")
        const hashedPassword = await bcrypt.hash(password, 10);

        /** transaction
         * - get the id(default_role_id) of the default role ('user') from the roles table
         * - insert the values(coming from body) in the users table
         * - get the id(user_id) of the created user
         * - insert the user_id and default_role_id to the user_roles table
         */

        const queries = [];
        const query1 = rds.queryOne<{}, {
            id: number
        }>({
            sql: `select id from misc_db."roles" where name = 'USER';`,
            params: {},
        });

        const query2 = rds.queryOne<{ fullname: string, email: string, password: string }, { id: number }>({
            sql: `INSERT INTO misc_db."user"
            (fullname, email, "password", avatar, created_at, is_verified, is_active)
            VALUES(:fullname, :email, :password, null, now(), false, true) returning id;`,
            params: { fullname, email, password: hashedPassword },
        })

        queries.push(query1, query2);

        const results = await Promise.all(queries);

        const [res1, err1] = results[0]
        const [res2, err2] = results[1]

        if (!res1?.data) {
            throw Error('Error while getting default role' + err1?.message + err1?.stack);
        }
        if (!res2?.data) {
            throw Error('Error while creating user' + err2?.message + err2?.stack);
        }

        const [result3, error3] = await rds.mutateOne<{ userId: number, roleId: number }, {}>({
            sql: `INSERT INTO misc_db.user_roles
                (user_id, role_id)
                VALUES(:userId, :roleId );
                `,
            params: { userId: res2?.data?.id, roleId: res1?.data?.id },
        });

    } catch (error: any) {
        throw new Error(error.message)
    }
}


export async function adminLogin(data: IAdmin) {
    try {
        const { email, password } = data;
        //check if email exists
        const queryExpr = db.selectFrom('misc_db.user').selectAll().where('email', '=', email);
        const rows = queryExpr.executeTakeFirst();
        type ResultType = Awaited<typeof rows>;
        const { sql, parameters } = await queryExpr.compile();

        const [result, error] = await rds.queryOne<{ email: string }, ResultType>({
            sql: sql,
            params: { email }
        })
        if (error !== null) {
            throw new Error("Error querying get user by email" + error.message + error.stack)
        }

        const user = result.data;
        if (!user) {
            throw new Error("User doesn't exist")
        }

        //check if passwords match
        const isPasswordMatch = await bcrypt.compare(password, user.password || "");
        if (!isPasswordMatch) {
            throw new Error('Passwords do not match');
        }
        return user;
    } catch (error: any) {
        throw new Error(error.message)
    }
}


/* 

 await db.transaction().execute(async (trx) => {
            const defaultRole = await trx.selectFrom('roles').select('id').where('name', '=', 'user').executeTakeFirstOrThrow();

            const user = await trx.insertInto('user').values({
                fullname: fullname,
                email: email,
                password: hashedPassword,
                is_active: true
            })
                .returning('id')
                .executeTakeFirstOrThrow();

            await trx.insertInto('user_roles').values({
                user_id: user.id,
                role_id: defaultRole.id
            }).executeTakeFirst()
        })
*/
