
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable('misc_db.discussion_qns')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('course_id', 'int8', col => col.references('misc_db.course.id').onDelete('cascade').notNull())
        .addColumn('user_id', 'int8', col => col.references('misc_db.user.id').onDelete('cascade').notNull())
        .addColumn('qn_title', 'varchar')
        .addColumn('qn_detail', 'varchar')
        .addColumn('created_at', 'timestamptz', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute()

    await db.schema.createTable('misc_db.discussion_replies')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('qn_id', 'int8', col => col.references('misc_db.discussion_qns.id').onDelete('cascade').notNull())
        .addColumn('user_id', 'int8', col => col.references('misc_db.user.id').onDelete('cascade').notNull())
        .addColumn('reply_text', 'varchar')
        .addColumn('created_at', 'timestamptz', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}
