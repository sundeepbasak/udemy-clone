
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('misc_db.video').execute()

    await db.schema
        .createTable('misc_db.video')
        .addColumn('id', 'bigserial', (col) => col.primaryKey())
        .addColumn('title', 'varchar', col => col.notNull())
        .addColumn('url', 'varchar', col => col.notNull())
        .addColumn('order', 'int2')
        .addColumn('previewable', 'boolean', col => col.defaultTo(false))
        .addColumn('section_id', 'int8', col => col.references('misc_db.section.id').onDelete('cascade').notNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
}

