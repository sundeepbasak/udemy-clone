
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await sql`ALTER TABLE misc_db.watch_history
    ALTER COLUMN progress TYPE smallint USING progress::smallint;`.execute(db)

}

export async function down(db: Kysely<any>): Promise<void> {
}
