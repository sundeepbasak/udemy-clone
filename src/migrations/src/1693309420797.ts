
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.watch_history')
        .addUniqueConstraint('unique_user_video', ['user_id', 'video_id'])
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
}
