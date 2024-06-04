
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('misc_db.course_enrollments')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('user_id', 'int8', (col) => col.references('misc_db.user.id').onDelete('cascade').notNull())
        .addColumn('course_id', 'int8', (col) => col.references('misc_db.course.id').onDelete('cascade').notNull())
        .addColumn('date', 'timestamptz', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .addColumn('payment_id', 'int8')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}
