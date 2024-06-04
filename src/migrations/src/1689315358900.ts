
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.user')
        .alterColumn('password', col => col.dropNotNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}
