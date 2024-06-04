
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('misc_db.discussion_qns')
        .addColumn('updated_at', 'timestamptz', col => col.defaultTo(sql`now()`).notNull())
        .execute();

    await db.schema.alterTable('misc_db.discussion_replies')
        .addColumn('updated_at', 'timestamptz', col => col.defaultTo(sql`now()`).notNull()) // Add updated_at column
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
}
