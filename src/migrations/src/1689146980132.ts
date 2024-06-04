
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('misc_db.roles')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('name', 'bigserial', col => col.notNull())
        .addColumn('permission_matrix', 'jsonb')
        .execute()

    await db.schema
        .alterTable('misc_db.user')
        .renameColumn('role', 'user_type')
        .execute()

    await db.schema
        .createTable('misc_db.user_roles')
        .addColumn('id', 'bigserial', col => col.primaryKey())
        .addColumn('user_id', 'int8', col => col.references('misc_db.user.id').onDelete('cascade').notNull())
        .addColumn('role_id', 'int8', col => col.references('misc_db.roles.id').onDelete('cascade').notNull())
        .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
}
