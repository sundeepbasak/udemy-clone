
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.watch_history')
        .addColumn('course_id', 'int8', (col) => col.references('misc_db.course.id').onDelete('cascade').notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
}
