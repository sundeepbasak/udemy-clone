import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider
} from "kysely";
import { Database } from "@/types/database.types";
import * as util from 'util';
import { RDS_DB_NAME, RDS_HOST, RDS_PASSWORD, RDS_PORT, RDS_USERNAME } from "@/constants/config.constants";

async function migrateToLatest() {
  console.log('migrate to latest hit....')

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: RDS_HOST,
        port: RDS_PORT,
        user: RDS_USERNAME,
        password: RDS_PASSWORD,
        database: RDS_DB_NAME,
      }),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname)
    })
  });

  const { error, results } = await migrator.migrateToLatest();

  console.log(util.inspect({ error, results }, false, null, true));

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();


/* 

 const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: 'localhost',
        user: 'postgres',
        password: 'password',
        database: 'lms',
      }),
    }),
  })
*/