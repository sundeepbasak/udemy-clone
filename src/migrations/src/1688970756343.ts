import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    //migration code
    await db.schema
        .createTable('misc_db.user')
        .addColumn('id', 'bigserial', (col) => col.primaryKey())
        .addColumn('fullname', 'varchar', (col) => col.notNull())
        .addColumn('email', 'varchar', (col) => col.unique().notNull())
        .addColumn('password', 'varchar', (col) => col.notNull())
        .addColumn('avatar', 'varchar')
        .addColumn('role', 'varchar', (col) => col.defaultTo('user').notNull())
        .addColumn('created_at', 'timestamptz', (col) =>
            col.defaultTo(sql`now()`).notNull()
        )
        .execute()

    await db.schema.createTable('misc_db.category')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('name', 'varchar', col => col.notNull())
        .execute()

    await db.schema
        .createTable('misc_db.course')
        .addColumn('id', 'bigserial', (col) => col.primaryKey())
        .addColumn('title', 'varchar', col => col.notNull())
        .addColumn('course_slug', 'varchar', col => col.notNull())
        .addColumn('description', 'varchar', col => col.notNull())
        .addColumn('thumbnail', 'varchar')
        .addColumn('instructor', 'varchar')
        .addColumn('category_id', 'bigserial', (col) =>
            col.references('misc_db.category.id').onDelete('cascade').notNull()
        )
        .execute()
}

export async function down(bd: Kysely<any>): Promise<void> {

}


/*  
up func --> is called when we want to update the database schema
down func --> is called when we want to go to the previous version
*/