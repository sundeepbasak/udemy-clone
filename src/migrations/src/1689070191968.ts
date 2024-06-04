
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.course')
        .alterColumn('category_id', col => col.dropNotNull())
        .alterColumn('category_id', col => col.setDataType('int8'))
        .alterColumn('sub_category_id', col => col.dropNotNull())
        .alterColumn('sub_category_id', col => col.setDataType('int8'))
        .execute()


    await db.schema
        .alterTable('misc_db.section')
        .alterColumn('course_id', col => col.dropNotNull())
        .alterColumn('course_id', col => col.setDataType('int8'))
        .execute()

    await db.schema
        .alterTable('misc_db.sub_category')
        .alterColumn('category_id', col => col.dropNotNull())
        .alterColumn('category_id', col => col.setDataType('int8'))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}
