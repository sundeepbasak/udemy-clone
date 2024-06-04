
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.watch_history')
        .addColumn('last_watched_at', 'timestamptz')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
}
