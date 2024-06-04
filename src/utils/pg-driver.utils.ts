import { Pool } from "pg";
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from "@/types/database.types";
import { RDS_DB_NAME, RDS_HOST, RDS_PASSWORD, RDS_PORT, RDS_USERNAME } from "@/constants/config.constants";

//DATABASE_URL="postgresql://postgres:password@localhost:5432/lms?schema=public"
const dialect = new PostgresDialect({
    pool: new Pool({
        host: 'localhost',
        port: 9969,
        user: RDS_USERNAME,
        password: RDS_PASSWORD,
        database: 'clinify',
        max: 10,
    })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<Database>({
    dialect,
})


/* 
database: 'lms',
host: 'localhost',
user: 'postgres',
password: "password",
port: 5432,
max: 10,
*/

/* 
database: RDS_DB_NAME,
        host: RDS_HOST,
        user: RDS_USERNAME,
        password: RDS_PASSWORD,
        port: RDS_PORT,
        max: 10,
*/