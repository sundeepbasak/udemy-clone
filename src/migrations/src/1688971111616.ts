import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {

    await db.schema
        .createTable('misc_db.sub_category')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('name', 'varchar', col => col.notNull())
        .addColumn('category_id', 'bigserial', col => col.references('misc_db.category.id').onDelete('cascade').notNull())
        .execute()

    await db.schema
        .alterTable('misc_db.course')
        .addColumn('sub_category_id', 'bigserial', (col) =>
            col.references('misc_db.sub_category.id').onDelete('cascade').notNull()
        )
        .addColumn('tags', 'varchar')
        .addColumn('requirements', 'varchar')
        .addColumn('contents', 'varchar')
        .addColumn('is_published', 'boolean', col => col.notNull())
        .addColumn('is_free', 'boolean', col => col.defaultTo(false).notNull())
        .addColumn('mrp_price', 'float4')
        .addColumn('discount', 'int2')
        .execute()

    await db.schema
        .createTable('misc_db.section')
        .addColumn('id', 'bigserial', (col) => col.primaryKey())
        .addColumn('title', 'varchar', col => col.notNull())
        .addColumn('thumbnail', 'varchar')
        .addColumn('description', 'varchar')
        .addColumn('order', 'int2')
        .addColumn('course_id', 'bigserial', col => col.references('misc_db.course.id').onDelete('cascade').notNull())
        .execute()

    await db.schema
        .createTable('misc_db.video')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('title', 'varchar', col => col.notNull())
        .addColumn('thumbnail', 'varchar')
        .addColumn('url', 'varchar', col => col.notNull())
        .addColumn('previewable', 'boolean', col => col.notNull())
        .addColumn('order', 'int2')
        .addColumn('section_id', 'bigserial', col => col.references('misc_db.section.id').onDelete('cascade').notNull())
        .execute()
}

export async function down(bd: Kysely<any>): Promise<void> {

}

