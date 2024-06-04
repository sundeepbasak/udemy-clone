
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.roles')
        .alterColumn('name', col => col.setDataType('varchar'))
        .execute()

    await db.schema
        .alterTable('misc_db.user')
        .dropColumn('user_type')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}
