
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable('misc_db.watch_history')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('user_id', 'int8', col => col.references('misc_db.user.id').onDelete('cascade').notNull())
        .addColumn('video_id', 'int8', col => col.references('misc_db.video.id').onDelete('cascade').notNull())
        .addColumn('progress', 'varchar')
        .addColumn('completed', 'boolean', col => col.defaultTo(false).notNull())
        .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
}
