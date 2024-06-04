import {
    DummyDriver,
    Driver,
    Kysely,
    PostgresAdapter,
    // PostgresCompiler,
    PostgresIntrospector,
    PostgresQueryCompiler,
} from 'kysely';

import { Database } from '@/types/database.types'

// class RDSDriver implements Driver {

// }

export const db = new Kysely<Database>({
    dialect: {
        createAdapter: () => new PostgresAdapter(),
        createDriver: () => new DummyDriver(),
        createIntrospector: (db) => new PostgresIntrospector(db),
        createQueryCompiler: () => new PostgresQueryCompiler(),
    },
})



/* 
what are hot kysely instances and cold kysely instances

*/