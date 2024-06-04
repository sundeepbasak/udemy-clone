import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('misc_db.user')
        .addColumn('is_verified', 'boolean', col => col.defaultTo(false).notNull())
        .execute()

    await db.schema
        .alterTable('misc_db.course')
        .addUniqueConstraint('uc_course_slug', ['course_slug'])
        .execute()

    await db.schema
        .alterTable('misc_db.section')
        .dropColumn('thumbnail')
        .execute()

    await db.schema
        .alterTable('misc_db.video')
        .dropColumn('thumbnail')
        .execute()
}

export async function down(bd: Kysely<any>): Promise<void> {

}

