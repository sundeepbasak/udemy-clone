
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.course')
        .alterColumn('category_id', col => col.setNotNull())
        .alterColumn('sub_category_id', col => col.setNotNull())
        .execute()

    await db.schema
        .alterTable('misc_db.section')
        .alterColumn('course_id', col => col.dropDefault())
        .alterColumn('course_id', col => col.setDataType('int8'))
        .alterColumn('course_id', col => col.setNotNull())
        .execute()

    await db.schema
        .alterTable('misc_db.sub_category')
        .alterColumn('category_id', col => col.dropDefault())
        .alterColumn('category_id', col => col.setDataType('int8'))
        .alterColumn('category_id', col => col.setNotNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}
