
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await sql`create sequence if not exists section_order_seq start 1;`.execute(db)
    await sql`create sequence if not exists video_order_seq start 1;`.execute(db)

    await sql`alter table misc_db.section alter column "order" set default nextval('section_order_seq'::regclass);`.execute(db)
    await sql`alter table misc_db.video alter column "order" set default nextval('video_order_seq'::regclass);`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
}
