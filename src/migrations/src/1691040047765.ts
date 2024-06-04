
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.user')
        .addColumn('is_active', 'boolean', col => col.defaultTo(false).notNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}
